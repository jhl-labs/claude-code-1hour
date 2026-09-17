// SPDX-License-Identifier: GPL-2.0+
/*
 * Host unit test for davinci_ecc_pack_1bit().
 *
 * Compares the real production helper (included verbatim from the
 * driver tree) against an independently bit-assembled reference
 * implementation, over a deterministic set of >= 1000 inputs plus a
 * handful of fixed boundary values. Also checks that the RESERVED
 * bits (31:28 and 15:12) are ignored by the packing.
 */

#define _DEFAULT_SOURCE
#include <assert.h>
#include <stdint.h>
#include <stdio.h>
#include <sys/types.h>

#include "davinci_ecc_pack.h"

/* Independent reference: assemble the 3 output bytes bit by bit,
 * without reusing the shift/mask trick used in the driver. */
static void reference_pack(uint32_t raw_ecc, unsigned char *out)
{
	/* The compacted 24-bit value takes bits 0..11 of raw_ecc
	 * verbatim, and bits 12..23 from raw_ecc bits 16..27
	 * (i.e. the RESERVED bits 31:28 and 15:12 are dropped). */
	unsigned char compact[24];
	unsigned char b;
	int i, j;

	for (i = 0; i < 12; i++)
		compact[i] = (raw_ecc >> i) & 1;
	for (i = 0; i < 12; i++)
		compact[12 + i] = (raw_ecc >> (16 + i)) & 1;

	for (i = 0; i < 3; i++) {
		b = 0;
		for (j = 0; j < 8; j++) {
			int bitpos = i * 8 + j;
			unsigned char bit = compact[bitpos] ^ 1; /* invert */

			b = (unsigned char)(b | (bit << j));
		}
		out[i] = b;
	}
}

static void check_one(uint32_t raw_ecc)
{
	unsigned char got[3];
	unsigned char want[3];

	davinci_ecc_pack_1bit(raw_ecc, got);
	reference_pack(raw_ecc, want);

	assert(got[0] == want[0]);
	assert(got[1] == want[1]);
	assert(got[2] == want[2]);
}

int main(void)
{
	unsigned int i;

	/* Fixed boundary values. */
	uint32_t boundaries[] = {
		0x00000000u,
		0xffffffffu,
		0x00000fffu, /* low 12 bits set */
		0x0fff0000u, /* mid 12 bits set */
		0xf0000000u, /* reserved bits 31:28 only */
		0x0000f000u, /* reserved bits 15:12 only */
		0xffff0fffu,
		0x12345678u,
		0xa5a5a5a5u,
		0x5a5a5a5au,
	};

	for (i = 0; i < sizeof(boundaries) / sizeof(boundaries[0]); i++)
		check_one(boundaries[i]);

	/* Reserved bits (31:28, 15:12) must be ignored: verify the
	 * packed output does not change when only reserved bits differ. */
	{
		unsigned char base[3], with_reserved[3];
		uint32_t clean = 0x1234abcdu & ~0xf000f000u;
		uint32_t noisy = clean | 0xf000f000u;

		davinci_ecc_pack_1bit(clean, base);
		davinci_ecc_pack_1bit(noisy, with_reserved);

		assert(base[0] == with_reserved[0]);
		assert(base[1] == with_reserved[1]);
		assert(base[2] == with_reserved[2]);
	}

	/* Deterministic pseudo-random sweep, >= 1000 inputs. */
	{
		uint32_t state = 0x2463a1b5u;

		for (i = 0; i < 5000; i++) {
			/* xorshift32, deterministic across runs */
			state ^= state << 13;
			state ^= state >> 17;
			state ^= state << 5;

			check_one(state);
		}
	}

	printf("ecc_pack_test: all checks passed\n");
	return 0;
}

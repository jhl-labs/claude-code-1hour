/* SPDX-License-Identifier: GPL-2.0+ */
/*
 * Bit packing helper for the DaVinci 1-bit hardware ECC result register.
 *
 * Extracted from nand_davinci_calculate_ecc() so the bit compaction /
 * inversion / byte packing logic can be unit tested independently of
 * the MMIO read.
 */

#ifndef __DAVINCI_ECC_PACK_H__
#define __DAVINCI_ECC_PACK_H__

/**
 * davinci_ecc_pack_1bit - squeeze the raw 32-bit 1-bit ECC register value
 * into the 3-byte on-flash ECC representation.
 * @raw_ecc: raw value read from davinci_emif_regs->nandfecc[]
 * @ecc_code: output buffer, must hold at least 3 bytes
 *
 * Squeeze 4 bytes ECC into 3 bytes by removing RESERVED bits and
 * shifting. RESERVED bits are 31 to 28 and 15 to 12. The result is
 * then inverted so that the erased block ECC is correct.
 */
static inline void davinci_ecc_pack_1bit(u_int32_t raw_ecc, u_char *ecc_code)
{
	u_int32_t tmp = raw_ecc;

	tmp = (tmp & 0x00000fff) | ((tmp & 0x0fff0000) >> 4);

	tmp = ~tmp;

	ecc_code[0] = tmp;
	ecc_code[1] = tmp >>  8;
	ecc_code[2] = tmp >> 16;
}

#endif /* __DAVINCI_ECC_PACK_H__ */

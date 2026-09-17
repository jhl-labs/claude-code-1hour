/* Teaching fixture: extract the low 12 bits, not a hardware/ECC test. */
#include <assert.h>
#include <stdio.h>
static unsigned low12(unsigned raw) { return raw & 0x00ffu; }
int main(void) {
    assert(low12(0u) == 0u);
    assert(low12(0xfaaafbbbu) == 0xbbbu);
    assert(low12(0xffffffffu) == 0xfffu);
    assert(low12(0xfffff000u) == 0u);
    puts("4 boundary cases passed");
    return 0;
}

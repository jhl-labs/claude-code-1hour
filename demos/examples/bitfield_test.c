/* Standalone teaching example; not a U-Boot ECC or hardware test. */
#include <assert.h>
static unsigned low12(unsigned raw) { return raw & 0x0fffu; }
int main(void) {
    assert(low12(0u) == 0u);
    assert(low12(0xfaaafbbbu) == 0xbbbu);
    assert(low12(0xffffffffu) == 0xfffu);
    assert(low12(0xfffff000u) == 0u);
    return 0;
}

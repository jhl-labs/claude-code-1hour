#!/usr/bin/env python3
# SPDX-License-Identifier: GPL-2.0+
"""
Mutation check for ecc_pack_test.c.

Compiles and runs the test against the real davinci_ecc_pack.h (must
pass), then against a temporary copy with one mask bit deliberately
flipped (must fail). The original header in the repo is never
modified.
"""
import resource
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent
DRIVER_DIR = ROOT.parent.parent / "drivers" / "mtd" / "nand" / "raw"
REAL_HEADER = DRIVER_DIR / "davinci_ecc_pack.h"
TEST_SRC = ROOT / "ecc_pack_test.c"

CC_ARGS = ["cc", "-std=c11", "-Wall", "-Wextra", "-Werror"]

SIGABRT = 6


def _disable_core_dump():
    resource.setrlimit(resource.RLIMIT_CORE, (0, 0))


class CompileError(Exception):
    pass


def compile_and_run(header_dir: Path, label: str) -> int:
    """Returns the test binary's returncode. Raises CompileError if
    compilation itself fails (which must never be treated as a
    successful mutant detection)."""
    with tempfile.TemporaryDirectory() as build_dir:
        binary = Path(build_dir) / "ecc_pack_test"
        compile_cmd = CC_ARGS + [
            "-I", str(header_dir),
            str(TEST_SRC),
            "-o", str(binary),
        ]
        compiled = subprocess.run(compile_cmd, capture_output=True, text=True)
        if compiled.returncode != 0:
            raise CompileError(
                f"[{label}] compile failed:\n{compiled.stdout}{compiled.stderr}")
        run = subprocess.run([str(binary)], capture_output=True, text=True,
                              preexec_fn=_disable_core_dump)
        print(f"[{label}] exit={run.returncode} {run.stdout.strip()} {run.stderr.strip()}")
        return run.returncode


def main() -> int:
    # 1) Baseline: real header must compile and pass.
    try:
        baseline_rc = compile_and_run(DRIVER_DIR, "baseline (real header)")
    except CompileError as e:
        print(f"FAIL: baseline failed to compile: {e}")
        return 1
    if baseline_rc != 0:
        print("FAIL: baseline test did not pass against the real header")
        return 1

    # 2) Mutant: copy the whole driver dir to a temp location, flip one
    #    mask bit in the copied header only, leave the original intact.
    original_text = REAL_HEADER.read_text()
    mutated_text = original_text.replace(
        "tmp = (tmp & 0x00000fff) | ((tmp & 0x0fff0000) >> 4);",
        "tmp = (tmp & 0x00000ffe) | ((tmp & 0x0fff0000) >> 4);",
        1,
    )
    if mutated_text == original_text:
        print("FAIL: mutation pattern not found in header; nothing was mutated")
        return 1

    with tempfile.TemporaryDirectory() as mutant_dir:
        mutant_dir_path = Path(mutant_dir)
        mutant_header = mutant_dir_path / "davinci_ecc_pack.h"
        mutant_header.write_text(mutated_text)

        try:
            mutant_rc = compile_and_run(mutant_dir_path, "mutant (1 mask bit flipped)")
        except CompileError as e:
            assert REAL_HEADER.read_text() == original_text, \
                "original header was modified, this must never happen"
            print(f"FAIL: mutant failed to compile instead of failing at runtime: {e}")
            return 1

    assert REAL_HEADER.read_text() == original_text, \
        "original header was modified, this must never happen"

    if mutant_rc != -SIGABRT:
        print(f"FAIL: mutant did not abort via assertion (SIGABRT); "
              f"got returncode={mutant_rc} instead")
        return 1

    print("OK: baseline passes, mutant aborts via assertion (SIGABRT), "
          "original header untouched")
    return 0


if __name__ == "__main__":
    sys.exit(main())

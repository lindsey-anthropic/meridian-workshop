"""
Restocking calibration parameters.

CALIBRATE: All values loaded from data/calibration.json are workshop assumptions.
Per proposal section 3.2 / A2 (technical-approach.md), the real engagement replaces
these in the week-1 VP Operations calibration session before the fixed fee commits.

Lookup precedence on get_params(sku, category):
    by_sku[sku]  ->  by_category[category]  ->  defaults
"""

import json
import os
from dataclasses import dataclass

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, 'data', 'calibration.json')


@dataclass(frozen=True)
class CalibrationParams:
    lead_time_days: int                          # CALIBRATE: per-supplier-SKU in real engagement
    cost_of_stockout_per_unit_per_day: float     # CALIBRATE: SLA / lost-margin model in real engagement
    unit_margin_ratio: float                     # CALIBRATE: contract pricing in real engagement
    preferred_supplier: str                      # CALIBRATE: full preferred/secondary list in real engagement


def _load() -> dict:
    with open(DATA_FILE, 'r') as f:
        return json.load(f)


_RAW = _load()
_DEFAULTS = _RAW['defaults']
_BY_CATEGORY_CI = {k.lower(): v for k, v in _RAW.get('by_category', {}).items()}
_BY_SKU_CI = {k.lower(): v for k, v in _RAW.get('by_sku', {}).items()}


def get_params(sku: str, category: str) -> CalibrationParams:
    """Resolve calibration values: by_sku -> by_category -> defaults. Case-insensitive."""
    entry = _BY_SKU_CI.get((sku or '').lower())
    if entry is None:
        entry = _BY_CATEGORY_CI.get((category or '').lower(), _DEFAULTS)
    # Merge over defaults so partial entries inherit missing keys.
    merged = {**_DEFAULTS, **entry}
    return CalibrationParams(
        lead_time_days=int(merged['lead_time_days']),
        cost_of_stockout_per_unit_per_day=float(merged['cost_of_stockout_per_unit_per_day']),
        unit_margin_ratio=float(merged['unit_margin_ratio']),
        preferred_supplier=str(merged['preferred_supplier']),
    )

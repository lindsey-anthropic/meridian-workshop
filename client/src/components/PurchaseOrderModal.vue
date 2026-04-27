<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen && backlogItem" class="modal-overlay" @click="close">
        <div class="modal-container" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">{{ mode === 'create' ? t('po.createTitle') : t('po.viewTitle') }}</h3>
            <button class="close-button" @click="close">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>

          <div class="modal-body">
            <div class="item-summary">
              <strong>{{ translateProductName(backlogItem.item_name) }}</strong>
              <span class="sku">{{ backlogItem.item_sku }}</span>
            </div>

            <div v-if="mode === 'create'" class="form-grid">
              <div class="form-group">
                <label>{{ t('po.supplier') }}</label>
                <input v-model="form.supplier_name" type="text" :placeholder="t('po.supplierPlaceholder')" />
              </div>
              <div class="form-group">
                <label>{{ t('po.quantity') }}</label>
                <input v-model.number="form.quantity" type="number" min="1" />
              </div>
              <div class="form-group">
                <label>{{ t('po.unitCost') }} ({{ currencySymbol }})</label>
                <input v-model.number="form.unit_cost" type="number" min="0" step="0.01" />
              </div>
              <div class="form-group">
                <label>{{ t('po.expectedDelivery') }}</label>
                <input v-model="form.expected_delivery_date" type="date" />
              </div>
              <div class="form-group full-width">
                <label>{{ t('po.notes') }}</label>
                <textarea v-model="form.notes" :placeholder="t('po.notesPlaceholder')" rows="2"></textarea>
              </div>
              <div v-if="formError" class="form-error">{{ formError }}</div>
            </div>

            <div v-else class="view-grid">
              <template v-if="loadingPO">{{ t('common.loading') }}</template>
              <template v-else-if="existingPO">
                <div class="info-item">
                  <div class="info-label">{{ t('po.supplier') }}</div>
                  <div class="info-value">{{ existingPO.supplier_name }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">{{ t('po.quantity') }}</div>
                  <div class="info-value">{{ existingPO.quantity }} {{ t('common.units') }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">{{ t('po.unitCost') }}</div>
                  <div class="info-value">{{ currencySymbol }}{{ existingPO.unit_cost.toFixed(2) }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">{{ t('po.expectedDelivery') }}</div>
                  <div class="info-value">{{ existingPO.expected_delivery_date }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">{{ t('po.status') }}</div>
                  <div class="info-value"><span class="badge warning">{{ existingPO.status }}</span></div>
                </div>
                <div v-if="existingPO.notes" class="info-item full-width">
                  <div class="info-label">{{ t('po.notes') }}</div>
                  <div class="info-value">{{ existingPO.notes }}</div>
                </div>
              </template>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-secondary" @click="close">{{ t('common.close') }}</button>
            <button v-if="mode === 'create'" class="btn-primary" :disabled="submitting" @click="submit">
              {{ submitting ? t('common.loading') : t('po.submit') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from '../composables/useI18n'
import { api } from '../api'

const { t, currentCurrency, translateProductName } = useI18n()

const currencySymbol = computed(() => currentCurrency.value === 'JPY' ? '¥' : '$')

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  backlogItem: { type: Object, default: null },
  mode: { type: String, default: 'create' }
})

const emit = defineEmits(['close', 'po-created'])

const form = ref({ supplier_name: '', quantity: 0, unit_cost: 0, expected_delivery_date: '', notes: '' })
const formError = ref(null)
const submitting = ref(false)
const existingPO = ref(null)
const loadingPO = ref(false)

watch(() => props.isOpen, async (open) => {
  if (!open) return
  formError.value = null
  if (props.mode === 'create' && props.backlogItem) {
    form.value = {
      supplier_name: '',
      quantity: Math.max((props.backlogItem.quantity_needed ?? 0) - (props.backlogItem.quantity_available ?? 0), 1),
      unit_cost: 0,
      expected_delivery_date: '',
      notes: ''
    }
  } else if (props.mode === 'view' && props.backlogItem) {
    loadingPO.value = true
    try {
      existingPO.value = await api.getPurchaseOrderByBacklogItem(props.backlogItem.id)
    } catch {
      existingPO.value = null
    } finally {
      loadingPO.value = false
    }
  }
})

const submit = async () => {
  if (!form.value.supplier_name.trim()) { formError.value = t('po.errorSupplier'); return }
  if (!form.value.expected_delivery_date) { formError.value = t('po.errorDate'); return }
  formError.value = null
  submitting.value = true
  try {
    const po = await api.createPurchaseOrder({
      backlog_item_id: props.backlogItem.id,
      supplier_name: form.value.supplier_name,
      quantity: form.value.quantity,
      unit_cost: form.value.unit_cost,
      expected_delivery_date: form.value.expected_delivery_date,
      notes: form.value.notes || undefined
    })
    emit('po-created', po)
  } catch (err) {
    formError.value = 'Failed to create PO: ' + err.message
  } finally {
    submitting.value = false
  }
}

const close = () => emit('close')
</script>

<style scoped>
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex; align-items: center; justify-content: center;
  z-index: 2000; padding: 1rem;
}
.modal-container {
  background: white; border-radius: 12px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.15);
  max-width: 560px; width: 100%; max-height: 90vh;
  overflow: hidden; display: flex; flex-direction: column;
}
.modal-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1.5rem; border-bottom: 1px solid #e2e8f0;
}
.modal-title { font-size: 1.125rem; font-weight: 700; color: #0f172a; }
.close-button {
  background: none; border: none; color: #64748b; cursor: pointer;
  padding: 0.5rem; border-radius: 6px; display: flex;
}
.close-button:hover { background: #f1f5f9; }
.modal-body { flex: 1; overflow-y: auto; padding: 1.5rem; }
.item-summary {
  display: flex; align-items: center; gap: 0.75rem;
  padding: 0.75rem 1rem; background: #f8fafc;
  border-radius: 8px; margin-bottom: 1.5rem;
  font-weight: 600; color: #0f172a;
}
.sku { font-size: 0.8rem; color: #64748b; font-weight: 400; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.form-group { display: flex; flex-direction: column; gap: 0.4rem; }
.form-group.full-width { grid-column: 1/-1; }
.form-group label { font-size: 0.8rem; font-weight: 600; color: #475569; text-transform: uppercase; letter-spacing: 0.04em; }
.form-group input, .form-group textarea {
  padding: 0.5rem 0.75rem; border: 1px solid #cbd5e1;
  border-radius: 8px; font-size: 0.875rem; font-family: inherit;
  color: #0f172a; background: #f8fafc;
}
.form-group input:focus, .form-group textarea:focus {
  outline: none; border-color: #3b82f6; background: white;
}
.form-error { grid-column: 1/-1; color: #dc2626; font-size: 0.875rem; }
.view-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
.info-item { display: flex; flex-direction: column; gap: 0.35rem; }
.info-item.full-width { grid-column: 1/-1; }
.info-label { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; }
.info-value { font-size: 0.9rem; color: #0f172a; font-weight: 500; }
.modal-footer {
  padding: 1.25rem 1.5rem; border-top: 1px solid #e2e8f0;
  display: flex; justify-content: flex-end; gap: 0.75rem;
}
.btn-secondary {
  padding: 0.5rem 1.25rem; background: #f1f5f9; border: 1px solid #e2e8f0;
  border-radius: 8px; font-size: 0.875rem; font-weight: 500; color: #334155; cursor: pointer;
}
.btn-secondary:hover { background: #e2e8f0; }
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-active .modal-container, .modal-leave-active .modal-container { transition: transform 0.2s ease; }
.modal-enter-from .modal-container, .modal-leave-to .modal-container { transform: scale(0.95); }
</style>

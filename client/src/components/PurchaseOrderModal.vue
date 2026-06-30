<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen && backlogItem" class="modal-overlay" @click="close">
        <div class="modal-container" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">
              {{ mode === 'view' ? 'Purchase Order' : 'Create Purchase Order' }}
            </h3>
            <button class="close-button" @click="close">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>

          <div class="modal-body">
            <div class="po-item-header">
              <div class="po-item-name">{{ translateProductName(backlogItem.item_name) }}</div>
              <div class="po-item-sku">SKU: {{ backlogItem.item_sku }}</div>
            </div>

            <!-- View mode -->
            <div v-if="mode === 'view'">
              <div v-if="loading" class="po-state">Loading purchase order…</div>
              <div v-else-if="error" class="po-state error">{{ error }}</div>
              <div v-else-if="existingPO" class="info-grid">
                <div class="info-item">
                  <div class="info-label">PO Number</div>
                  <div class="info-value order-id">{{ existingPO.id }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Supplier</div>
                  <div class="info-value">{{ existingPO.supplier_name }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Quantity</div>
                  <div class="info-value">{{ existingPO.quantity }} units</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Unit Cost</div>
                  <div class="info-value">{{ formatCurrency(existingPO.unit_cost, currentCurrency) }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Total</div>
                  <div class="info-value">{{ formatCurrency(existingPO.quantity * existingPO.unit_cost, currentCurrency) }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Expected Delivery</div>
                  <div class="info-value">{{ existingPO.expected_delivery_date }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Status</div>
                  <div class="info-value"><span class="badge">{{ existingPO.status }}</span></div>
                </div>
                <div class="info-item" v-if="existingPO.notes">
                  <div class="info-label">Notes</div>
                  <div class="info-value">{{ existingPO.notes }}</div>
                </div>
              </div>
            </div>

            <!-- Create mode -->
            <form v-else class="po-form" @submit.prevent="submit">
              <div class="form-row">
                <label class="form-label" for="po-supplier">Supplier</label>
                <input id="po-supplier" v-model="form.supplier_name" type="text" class="form-input" required />
              </div>
              <div class="form-grid">
                <div class="form-row">
                  <label class="form-label" for="po-qty">Quantity</label>
                  <input id="po-qty" v-model.number="form.quantity" type="number" min="1" class="form-input" required />
                </div>
                <div class="form-row">
                  <label class="form-label" for="po-cost">Unit Cost</label>
                  <input id="po-cost" v-model.number="form.unit_cost" type="number" min="0" step="0.01" class="form-input" required />
                </div>
              </div>
              <div class="form-row">
                <label class="form-label" for="po-date">Expected Delivery Date</label>
                <input id="po-date" v-model="form.expected_delivery_date" type="date" class="form-input" required />
              </div>
              <div class="form-row">
                <label class="form-label" for="po-notes">Notes (optional)</label>
                <textarea id="po-notes" v-model="form.notes" class="form-input" rows="2"></textarea>
              </div>
              <div v-if="error" class="po-state error">{{ error }}</div>
            </form>
          </div>

          <div class="modal-footer">
            <button class="btn-secondary" @click="close">Close</button>
            <button
              v-if="mode === 'create'"
              class="btn-primary"
              :disabled="!canSubmit || submitting"
              @click="submit"
            >
              {{ submitting ? 'Creating…' : 'Create PO' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { api } from '../api'
import { useI18n } from '../composables/useI18n'
import { formatCurrency } from '../utils/currency'

const { translateProductName, currentCurrency } = useI18n()

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  backlogItem: { type: Object, default: null },
  mode: { type: String, default: 'create' }
})

const emit = defineEmits(['close', 'po-created'])

const loading = ref(false)
const submitting = ref(false)
const error = ref(null)
const existingPO = ref(null)

const form = reactive({
  supplier_name: '',
  quantity: 0,
  unit_cost: 0,
  expected_delivery_date: '',
  notes: ''
})

const canSubmit = computed(() =>
  form.supplier_name.trim() &&
  form.quantity > 0 &&
  form.unit_cost >= 0 &&
  form.expected_delivery_date
)

const resetForm = () => {
  const shortage = props.backlogItem
    ? Math.max(0, (props.backlogItem.quantity_needed || 0) - (props.backlogItem.quantity_available || 0))
    : 0
  form.supplier_name = ''
  form.quantity = shortage || 1
  form.unit_cost = 0
  form.expected_delivery_date = ''
  form.notes = ''
}

// When the modal opens, either load the existing PO (view) or seed the form (create).
watch(
  () => props.isOpen,
  async (open) => {
    if (!open || !props.backlogItem) return
    error.value = null
    if (props.mode === 'view') {
      loading.value = true
      try {
        existingPO.value = await api.getPurchaseOrderByBacklogItem(props.backlogItem.id)
      } catch (err) {
        error.value = 'No purchase order found for this item.'
        existingPO.value = null
      } finally {
        loading.value = false
      }
    } else {
      resetForm()
    }
  }
)

const submit = async () => {
  if (!canSubmit.value || submitting.value) return
  submitting.value = true
  error.value = null
  try {
    const po = await api.createPurchaseOrder({
      backlog_item_id: props.backlogItem.id,
      supplier_name: form.supplier_name.trim(),
      quantity: form.quantity,
      unit_cost: form.unit_cost,
      expected_delivery_date: form.expected_delivery_date,
      notes: form.notes.trim() || null
    })
    emit('po-created', po)
  } catch (err) {
    error.value = 'Failed to create purchase order. Please try again.'
  } finally {
    submitting.value = false
  }
}

const close = () => emit('close')
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
}

.modal-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
  max-width: 560px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.025em;
}

.close-button {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.15s ease;
}

.close-button:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
}

.po-item-header {
  padding-bottom: 1.25rem;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 1.5rem;
}

.po-item-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
}

.po-item-sku {
  font-size: 0.875rem;
  color: #64748b;
  font-family: 'Monaco', 'Courier New', monospace;
  margin-top: 0.25rem;
}

.po-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

.form-row {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-label {
  font-size: 0.813rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #64748b;
}

.form-input {
  padding: 0.6rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.938rem;
  color: #0f172a;
  font-family: inherit;
}

.form-input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-label {
  font-size: 0.813rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #64748b;
}

.info-value {
  font-size: 0.938rem;
  color: #0f172a;
  font-weight: 500;
}

.info-value.order-id {
  font-family: 'Monaco', 'Courier New', monospace;
  color: #2563eb;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.813rem;
  font-weight: 600;
  background: #dbeafe;
  color: #1e40af;
}

.po-state {
  padding: 1rem 0;
  color: #64748b;
}

.po-state.error {
  color: #dc2626;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.btn-secondary {
  padding: 0.625rem 1.25rem;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.875rem;
  color: #334155;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: inherit;
}

.btn-secondary:hover {
  background: #e2e8f0;
  border-color: #cbd5e1;
}

.btn-primary {
  padding: 0.625rem 1.25rem;
  background: #2563eb;
  border: 1px solid #2563eb;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  color: white;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: inherit;
}

.btn-primary:hover:not(:disabled) {
  background: #1d4ed8;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.2s ease;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.95);
}
</style>

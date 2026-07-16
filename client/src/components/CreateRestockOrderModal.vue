<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen && recommendation" class="modal-overlay" @click="close">
        <div class="modal-container" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">{{ t('restocking.createOrder') }}</h3>
            <button class="close-button" @click="close">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>

          <div class="modal-body">
            <div class="item-summary">
              <div class="item-name">{{ recommendation.name }}</div>
              <div class="item-sku">SKU: {{ recommendation.sku }} · {{ recommendation.warehouse }}</div>
            </div>

            <form class="po-form" @submit.prevent="handleSubmit">
              <div class="form-row">
                <div class="form-group flex-1">
                  <label for="supplier-name">Supplier Name</label>
                  <input
                    id="supplier-name"
                    v-model="form.supplierName"
                    type="text"
                    placeholder="e.g. Pacific Components Ltd."
                    class="po-input"
                    required
                  />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="po-quantity">Quantity</label>
                  <input
                    id="po-quantity"
                    v-model.number="form.quantity"
                    type="number"
                    min="1"
                    class="po-input"
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="po-unit-cost">Unit Cost ($)</label>
                  <input
                    id="po-unit-cost"
                    v-model.number="form.unitCost"
                    type="number"
                    min="0"
                    step="0.01"
                    class="po-input"
                    required
                  />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group flex-1">
                  <label for="po-delivery-date">Expected Delivery Date</label>
                  <input
                    id="po-delivery-date"
                    v-model="form.expectedDeliveryDate"
                    type="date"
                    class="po-input"
                    required
                  />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group flex-1">
                  <label for="po-notes">Notes (optional)</label>
                  <textarea
                    id="po-notes"
                    v-model="form.notes"
                    class="po-input"
                    rows="2"
                    placeholder="Any additional context for this order..."
                  ></textarea>
                </div>
              </div>

              <div v-if="submitError" class="error">{{ submitError }}</div>
            </form>
          </div>

          <div class="modal-footer">
            <button class="btn-secondary" @click="close">Close</button>
            <button
              class="btn-primary"
              :disabled="submitting || !isFormValid"
              @click="handleSubmit"
            >
              {{ submitting ? 'Creating...' : t('restocking.createOrder') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { api } from '../api'
import { useI18n } from '../composables/useI18n'

export default {
  name: 'CreateRestockOrderModal',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    recommendation: {
      type: Object,
      default: null
    }
  },
  emits: ['close', 'order-created'],
  setup(props, { emit }) {
    const { t } = useI18n()

    const form = ref({
      supplierName: '',
      quantity: 0,
      unitCost: 0,
      expectedDeliveryDate: '',
      notes: ''
    })

    const submitting = ref(false)
    const submitError = ref(null)

    const isFormValid = computed(() => {
      return form.value.supplierName.trim() &&
        form.value.quantity > 0 &&
        form.value.unitCost >= 0 &&
        form.value.expectedDeliveryDate
    })

    const resetForm = () => {
      if (!props.recommendation) return
      form.value = {
        supplierName: '',
        quantity: props.recommendation.funded_quantity || props.recommendation.recommended_quantity,
        unitCost: props.recommendation.unit_cost,
        expectedDeliveryDate: '',
        notes: ''
      }
      submitError.value = null
    }

    watch(() => [props.isOpen, props.recommendation], () => {
      if (props.isOpen) resetForm()
    }, { immediate: true })

    const handleSubmit = async () => {
      if (!isFormValid.value || submitting.value) return

      try {
        submitting.value = true
        submitError.value = null

        const poData = await api.createRestockOrder({
          inventory_sku: props.recommendation.sku,
          supplier_name: form.value.supplierName.trim(),
          quantity: form.value.quantity,
          unit_cost: form.value.unitCost,
          expected_delivery_date: form.value.expectedDeliveryDate,
          notes: form.value.notes.trim() || null
        })

        emit('order-created', { sku: props.recommendation.sku, purchaseOrder: poData })
      } catch (err) {
        submitError.value = 'Failed to create order: ' + (err.response?.data?.detail || err.message)
      } finally {
        submitting.value = false
      }
    }

    const close = () => {
      emit('close')
    }

    return {
      t,
      form,
      submitting,
      submitError,
      isFormValid,
      handleSubmit,
      close
    }
  }
}
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

.item-summary {
  padding-bottom: 1.25rem;
  margin-bottom: 1.25rem;
  border-bottom: 1px solid #e2e8f0;
}

.item-name {
  font-size: 1.15rem;
  font-weight: 700;
  color: #0f172a;
}

.item-sku {
  font-size: 0.85rem;
  color: #64748b;
  margin-top: 0.25rem;
  font-family: 'Monaco', 'Courier New', monospace;
}

.po-form {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  flex: 1;
}

.form-group label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #475569;
}

.po-input {
  padding: 0.6rem 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.9rem;
  font-family: inherit;
  transition: border-color 0.2s ease;
}

.po-input:focus {
  outline: none;
  border-color: #3b82f6;
}

textarea.po-input {
  resize: vertical;
}

.error {
  background: #fee2e2;
  color: #991b1b;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
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
  background: #3b82f6;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  color: white;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: inherit;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
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

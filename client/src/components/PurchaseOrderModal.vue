<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="handleClose">
    <div class="modal-content">
      <div class="modal-header">
        <h3>{{ mode === 'create' ? 'Create Purchase Order' : 'View Purchase Order' }}</h3>
        <button class="close-btn" @click="handleClose">×</button>
      </div>

      <div class="modal-body">
        <div v-if="mode === 'create'" class="form-group">
          <label>Supplier Name</label>
          <input v-model="supplierName" type="text" placeholder="Enter supplier name" />
        </div>

        <div class="form-group">
          <label>Quantity</label>
          <input v-model.number="quantity" type="number" min="0" />
          <small v-if="mode === 'create'">
            Need {{ quantityNeeded }} units (have {{ quantityAvailable }} in stock)
          </small>
        </div>

        <div v-if="mode === 'create'" class="form-group">
          <label>Unit Cost</label>
          <input v-model.number="unitCost" type="number" min="0" step="0.01" />
        </div>

        <div v-if="mode === 'create'" class="form-group">
          <label>Expected Delivery</label>
          <input v-model="expectedDelivery" type="date" />
        </div>

        <div v-if="mode === 'create'" class="form-group">
          <label>Notes</label>
          <textarea v-model="notes" placeholder="Add any notes..." rows="3"></textarea>
        </div>

        <!-- View mode -->
        <div v-if="mode === 'view' && currentPO">
          <div class="po-view">
            <div class="detail-row">
              <span class="label">PO #:</span>
              <span class="value">{{ currentPO.id }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Status:</span>
              <span class="value">{{ currentPO.status }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Supplier:</span>
              <span class="value">{{ currentPO.supplier_name }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Quantity:</span>
              <span class="value">{{ currentPO.quantity }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Unit Cost:</span>
              <span class="value">${{ currentPO.unit_cost?.toFixed(2) || 'N/A' }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Total Cost:</span>
              <span class="value">${{ currentPO.estimated_cost?.toFixed(2) || 'N/A' }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Created:</span>
              <span class="value">{{ currentPO.created_date }}</span>
            </div>
            <div v-if="currentPO.expected_delivery_date" class="detail-row">
              <span class="label">Expected Delivery:</span>
              <span class="value">{{ currentPO.expected_delivery_date }}</span>
            </div>
            <div v-if="currentPO.notes" class="detail-row">
              <span class="label">Notes:</span>
              <span class="value">{{ currentPO.notes }}</span>
            </div>
          </div>
        </div>

        <div v-if="loading" class="loading">Loading...</div>
        <div v-if="error" class="error">{{ error }}</div>
      </div>

      <div class="modal-footer">
        <button class="btn btn-secondary" @click="handleClose">{{ mode === 'view' ? 'Close' : 'Cancel' }}</button>
        <button v-if="mode === 'create'" class="btn btn-primary" :disabled="!canSubmit" @click="submit">
          {{ submitting ? 'Creating...' : 'Create PO' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { api } from '../api'

export default {
  name: 'PurchaseOrderModal',
  props: {
    isOpen: Boolean,
    backlogItem: Object,
    mode: {
      type: String,
      default: 'create'
    }
  },
  emits: ['close', 'po-created'],
  setup(props, { emit }) {
    const supplierName = ref('')
    const quantity = ref(0)
    const unitCost = ref(0)
    const expectedDelivery = ref('')
    const notes = ref('')
    const submitting = ref(false)
    const loading = ref(false)
    const error = ref(null)
    const currentPO = ref(null)

    const quantityNeeded = computed(() => props.backlogItem?.quantity_needed || 0)
    const quantityAvailable = computed(() => props.backlogItem?.quantity_available || 0)

    const canSubmit = computed(() => {
      return props.mode === 'create' && supplierName.value.trim() && quantity.value > 0 && unitCost.value >= 0
    })

    const handleClose = () => {
      reset()
      emit('close')
    }

    const reset = () => {
      supplierName.value = ''
      quantity.value = 0
      unitCost.value = 0
      expectedDelivery.value = ''
      notes.value = ''
      error.value = null
      currentPO.value = null
    }

    const submit = async () => {
      try {
        submitting.value = true
        error.value = null
        const poData = {
          backlog_item_id: props.backlogItem?.id,
          supplier_name: supplierName.value,
          quantity: quantity.value,
          unit_cost: unitCost.value,
          expected_delivery_date: expectedDelivery.value || undefined,
          notes: notes.value || undefined
        }
        const po = await api.createPurchaseOrder(poData)
        emit('po-created', po)
        handleClose()
      } catch (err) {
        error.value = err.message || 'Failed to create PO'
      } finally {
        submitting.value = false
      }
    }

    const loadPO = async () => {
      try {
        loading.value = true
        error.value = null
        currentPO.value = await api.getPurchaseOrderByBacklogItem(props.backlogItem?.id)
      } catch (err) {
        error.value = 'Could not load purchase order'
      } finally {
        loading.value = false
      }
    }

    watch(
      () => [props.isOpen, props.mode],
      () => {
        if (props.isOpen && props.mode === 'view') {
          loadPO()
        } else if (props.isOpen && props.mode === 'create') {
          reset()
          if (props.backlogItem) {
            quantity.value = quantityNeeded.value - quantityAvailable.value
          }
        }
      }
    )

    return {
      supplierName,
      quantity,
      unitCost,
      expectedDelivery,
      notes,
      submitting,
      loading,
      error,
      currentPO,
      quantityNeeded,
      quantityAvailable,
      canSubmit,
      handleClose,
      submit
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
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #0f172a;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #64748b;
}

.close-btn:hover {
  color: #0f172a;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 0.5rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.95rem;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.form-group small {
  display: block;
  color: #64748b;
  margin-top: 0.25rem;
  font-size: 0.875rem;
}

.po-view {
  background: #f8fafc;
  border-radius: 8px;
  padding: 1rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e2e8f0;
}

.detail-row:last-child {
  border-bottom: none;
}

.label {
  font-weight: 600;
  color: #64748b;
}

.value {
  color: #0f172a;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #64748b;
}

.error {
  background: #fee2e2;
  color: #991b1b;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
}

.btn {
  padding: 0.6rem 1.25rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #2563eb, #06b6d4);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: #e2e8f0;
  color: #0f172a;
}

.btn-secondary:hover {
  background: #cbd5e1;
}
</style>

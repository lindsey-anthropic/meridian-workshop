<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen && backlogItem" class="modal-overlay" @click="$emit('close')">
        <div class="modal-container" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">
              {{ mode === 'view' ? 'Purchase Order Details' : 'Create Purchase Order' }}
            </h3>
            <button class="close-button" @click="$emit('close')">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>

          <div class="modal-body">
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Item</div>
                <div class="info-value">{{ backlogItem.item_name }}</div>
              </div>
              <div class="info-item">
                <div class="info-label">SKU</div>
                <div class="info-value">{{ backlogItem.item_sku }}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Order ID</div>
                <div class="info-value">{{ backlogItem.order_id }}</div>
              </div>
            </div>

            <div v-if="mode === 'view' && backlogItem.purchase_order" class="po-details">
              <div class="info-item">
                <div class="info-label">PO Number</div>
                <div class="info-value">{{ backlogItem.purchase_order.id }}</div>
              </div>
            </div>

            <div v-if="mode === 'create'" class="po-form">
              <div class="form-group">
                <label class="form-label">Quantity</label>
                <input v-model.number="quantity" type="number" class="form-input" min="1" />
              </div>
              <div class="form-group">
                <label class="form-label">Notes</label>
                <textarea v-model="notes" class="form-input" rows="3" />
              </div>
              <div class="form-actions">
                <button class="btn btn-secondary" @click="$emit('close')">Cancel</button>
                <button class="btn btn-primary" @click="submitPO">Create PO</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'PurchaseOrderModal',
  props: {
    isOpen: { type: Boolean, default: false },
    backlogItem: { type: Object, default: null },
    mode: { type: String, default: 'create' }
  },
  emits: ['close', 'po-created'],
  setup(props, { emit }) {
    const quantity = ref(1)
    const notes = ref('')

    const submitPO = () => {
      const poData = {
        id: `PO-${Date.now()}`,
        backlog_item_id: props.backlogItem?.id,
        quantity: quantity.value,
        notes: notes.value
      }
      emit('po-created', poData)
      quantity.value = 1
      notes.value = ''
    }

    return { quantity, notes, submitPO }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  background: var(--color-bg-primary, #fff);
  border-radius: 12px;
  padding: 24px;
  width: 480px;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text-primary, #111);
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-secondary, #666);
  padding: 4px;
}

.info-grid {
  display: grid;
  gap: 12px;
  margin-bottom: 20px;
}

.info-label {
  font-size: 0.75rem;
  color: var(--color-text-secondary, #666);
  margin-bottom: 2px;
}

.info-value {
  font-weight: 500;
  color: var(--color-text-primary, #111);
}

.form-group {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 6px;
  color: var(--color-text-primary, #111);
}

.form-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--color-border, #ddd);
  border-radius: 6px;
  font-size: 0.875rem;
  box-sizing: border-box;
  background: var(--color-bg-primary, #fff);
  color: var(--color-text-primary, #111);
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
}

.btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
}

.btn-primary {
  background: var(--color-accent, #3b82f6);
  color: #fff;
}

.btn-secondary {
  background: var(--color-bg-secondary, #f3f4f6);
  color: var(--color-text-primary, #111);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>

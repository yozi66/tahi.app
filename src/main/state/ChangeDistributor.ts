import { AnyChange } from '@common/types/AnyChange';

type WindowId = number;

export class ChangeDistributor {
  private _queues = new Map<WindowId, AnyChange[]>();

  register(windowId: WindowId): void {
    console.log(`Registering window ${windowId} for change distribution`);
    if (!this._queues.has(windowId)) {
      this._queues.set(windowId, []);
    }
  }

  unregister(windowId: WindowId): void {
    this._queues.delete(windowId);
  }

  enqueueForObservers(changes: AnyChange[]): void {
    if (changes.length === 0) {
      return;
    }
    for (const queue of this._queues.values()) {
      queue.push(...changes);
    }
  }

  drain(windowId: WindowId): AnyChange[] {
    const queue = this._queues.get(windowId);
    if (!queue || queue.length === 0) {
      return [];
    }
    const payload = queue.slice();
    queue.length = 0;
    return payload;
  }
}

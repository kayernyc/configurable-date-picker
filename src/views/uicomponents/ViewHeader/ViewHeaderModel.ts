type ViewHeaderModelSubscriptionCallback = (date: Date) => void
type ViewHeaderModelUnsubscribe = () => void;

export default class ViewHeaderModel {
  listeners: ViewHeaderModelSubscriptionCallback[] = []

  updateRepresentedDate(): void {
    //
  }

  createUnsubscribe = (callback: ViewHeaderModelSubscriptionCallback): ViewHeaderModelUnsubscribe => {
    return () => {
      console.log('i am called', this.listeners)
    }
  }

  subscribe = (callback: ViewHeaderModelSubscriptionCallback): ViewHeaderModelUnsubscribe => {
    this.listeners.push(callback)
    return this.createUnsubscribe(callback)
  }
}
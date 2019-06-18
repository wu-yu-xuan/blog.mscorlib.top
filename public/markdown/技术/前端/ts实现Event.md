# ts实现Event

> talk is cheap, show me your code

```typescript
interface IOpions {
  once: boolean;
}

interface IListener {
  listener: (...args: any[]) => void;
  options: IOpions;
}

class MyEvent {
  private listenerMap = new Map<string, IListener[]>();
  public on(type: string, listener: (...args: any[]) => void, options: IOpions = { once: false }) {
    const old = this.listenerMap.get(type) || [];
    old.push({ listener, options });
    this.listenerMap.set(type, old);
  }
  public once(type: string, listener: (...args: any[]) => void) {
    return this.on(type, listener, { once: true });
  }
  public listeners(type: string) {
    return (this.listenerMap.get(type) || []).map(l => l.listener);
  }
  public trigger(type: string, ...args: any[]) {
    const old = this.listenerMap.get(type) || [];
    old.forEach(v => v.listener(...args));
    this.listenerMap.set(type, old.filter(v => !v.options.once));
  }
  public remove(type: string, listener: (...args: any[]) => void) {
    this.listenerMap.set(type, (this.listenerMap.get(type) || []).filter(v => v.listener === listener));
  }
  public removeAll(type: string) {
    this.listenerMap.set(type, []);
  }
}

const e = new MyEvent();
e.on('wyx', console.log);
e.once('wyx', () => console.log('222'));
e.trigger('wyx', '111');
e.trigger('wyx', '333');
e.remove('wyx', console.log);
e.trigger('wyx');
```

result:

```
111
222
333
```
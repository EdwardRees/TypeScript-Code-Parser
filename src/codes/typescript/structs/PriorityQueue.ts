class QueueNode {
  private priority: number;
  private value: any;

  public constructor(priority: number, value: any) {
    this.priority = priority;
    this.value = value;
  }

  public toString(): string {
    return `Priority: ${this.priority}, Value: ${this.value}`;
  }

  public getValue(): any {
    return this.value;
  }

  public getPriority(): number {
    return this.priority;
  }
}

export class PriorityQueue {
  private queue: QueueNode[];
  private valuesUsed: number[];
  private top: number;
  private index: number;
  private bottom: number;
  private TOP_STEP = 5;

  public constructor() {
    this.queue = [];
    this.valuesUsed = [];
    this.top = 0;
    this.index = 0;
    this.bottom = 0;
  }

  public toString(): string {
    let str = "Priority Queue Data:\n";
    str += this.queue.join("\n");
    return str;
  }

  private sort(): void {
    this.queue.sort((a, b) => b.getPriority() - a.getPriority());
  }

  public insert(value: any, priority?: number) : void{
    if(priority == null){
      priority = this.index++;
    }
    this.queue.push(new QueueNode(priority, value));
    this.valuesUsed.push(priority);
    this.sort();
  }

  public delete(): QueueNode {
    this.queue.reverse();
    let removed = this.queue.pop();
    this.queue.reverse();
    return removed;
  }
}

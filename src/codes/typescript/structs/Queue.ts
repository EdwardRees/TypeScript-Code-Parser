class Queue {
  private queue: Array<any>;
  private size: number;

  constructor() {
    this.queue = new Array<any>();
    this.size = 0;
  }

  public enqueue(data: any): void {
    this.queue.push(data);
    this.size += 1;
  }

  public dequeue(): any {
    if(this.size === 0){
      return null;
    }
    let temp = this.queue[0];
    for(let i=0; i<this.size - 1; i++){
      this.queue[i] = this.queue[i + 1];
    }
    this.queue.splice(this.size - 1, 1);
    this.size -= 1;
    return temp;
  }

  public toString(): string {
    return this.queue.toString();
  }
}

class Stack {
  private stack : Array<any>;
  private size : number;

  constructor(){
    this.stack = new Array<any>();
    this.size = 0;
  }

  public toString() : string {
    return this.stack.toString();
  }

  public push(data: any) : void {
    this.size += 1;
    this.stack.push(0);
    for(let i=this.size - 1; i > 0; i--){
      this.stack[i] = this.stack[i - 1];
    }
    this.stack[0] = data;
  }

  public pop(): any {
    if(this.size == 0){
      return null;
    }
    let temp = this.stack[0];
    for(let i=0; i < this.size - 1; i++){
      this.stack[i] = this.stack[i + 1];
    }
    this.stack.splice(this.size - 1, 1);
    this.size -= 1;
    return temp;
  }
}


let s = new Stack();
s.push(1);
s.push(2);
s.push(3);
console.log(`${s}`);
console.log(s.pop());
console.log(`${s}`);
s.pop();
s.pop();
s.pop();
s.pop();
console.log(`Stack: ${s}`);

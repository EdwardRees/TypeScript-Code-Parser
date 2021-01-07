class BSTNode<T> {
  private data: T;
  private left: BSTNode<T>;
  private right: BSTNode<T>;

  constructor(data: T) {
    this.data = data;
    this.left = null;
    this.right = null;
  }

  public getRight(): BSTNode<T> {
    return this.right;
  }
  public getLeft(): BSTNode<T> {
    return this.left;
  }
  public setRight(node: BSTNode<T>): void {
    this.right = node;
  }
  public setLeft(node: BSTNode<T>): void {
    this.left = node;
  }

  public setData(data: T): void {
    this.data = data;
  }

  public getData(): T {
    return this.data;
  }
}

class BST<T> {
  private head: BSTNode<T>;

  constructor() {
    this.head = null;
  }

  public add(data: T, head?: BSTNode<T>): void {
    if (this.head == null) {
      this.head = new BSTNode<T>(data);
      return;
    }
    head = this.head;
    if (head != null) {
      if (head.getData() > data) {
        if (head.getLeft() === null) {
          head.setLeft(new BSTNode<T>(data));
          return;
        } else {
          if (head.getLeft().getData() > data) {
            this.add(data, head.getLeft());
          }
        }
      } else if (head.getData() < data) {
        if (head.getRight() === null) {
          head.setRight(new BSTNode<T>(data));
          return;
        } else {
          if (head.getRight().getData() < data) {
            this.add(data, head.getRight());
          }
        }
      }
    }
  }
  public find(item: T, node?: BSTNode<T>, checkedPrev: boolean = false): boolean {
    if (node == null) {
      return false;
    }
    if(node === null && null != this.head && (checkedPrev === null || checkedPrev === false)){
      node = this.head;
    }
    if (node.getData() === item) {
      return true;
    } else if (node.getData() < item) {
      return this.find(item, node.getRight(), true);
    } else {
      return this.find(item, node.getLeft(), true);
    }
  }
}


let b = new BST<number>();
b.add(6);
b.add(9);
b.add(2);
b.add(1);
console.log(b.find(1));

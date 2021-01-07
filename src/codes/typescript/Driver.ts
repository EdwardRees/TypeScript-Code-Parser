import { LinkedList } from './structs/LinkedList';
import { PriorityQueue } from './structs/PriorityQueue';

class TestLinkedList {

  public static main = () => {
    
    var ll = new LinkedList();
    ll.add("Hello");
    ll.add("World");
    ll.add("Edward");
    ll.remove(1);
    console.log(ll.toString());
    
  }
}

class TestPriorityQueue {
  public static main = () => {
    var pq = new PriorityQueue();
    pq.insert("hello");
    pq.insert("john", 10);
    pq.insert("world");

    console.log(pq.toString());

    pq.delete();
    console.log(pq.toString());
  }
}

TestPriorityQueue.main();
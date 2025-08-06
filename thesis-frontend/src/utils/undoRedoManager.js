
class UndoRedoManager {
  constructor(maxHistorySize = 50) {
    this.history = [];
    this.currentIndex = -1;
    this.maxHistorySize = maxHistorySize;
    this.listeners = [];
  }

  push(state) {

    this.history = this.history.slice(0, this.currentIndex + 1);
    

    this.history.push({
      state: JSON.parse(JSON.stringify(state)),
      timestamp: Date.now()
    });
    

    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
    } else {
      this.currentIndex++;
    }
    
    this.notifyListeners();
  }

  undo() {
    if (this.canUndo()) {
      this.currentIndex--;
      this.notifyListeners();
      return this.getCurrentState();
    }
    return null;
  }

  redo() {
    if (this.canRedo()) {
      this.currentIndex++;
      this.notifyListeners();
      return this.getCurrentState();
    }
    return null;
  }

  canUndo() {
    return this.currentIndex > 0;
  }

  canRedo() {
    return this.currentIndex < this.history.length - 1;
  }

  getCurrentState() {
    if (this.currentIndex >= 0 && this.currentIndex < this.history.length) {
      return this.history[this.currentIndex].state;
    }
    return null;
  }

  clear() {
    this.history = [];
    this.currentIndex = -1;
    this.notifyListeners();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notifyListeners() {
    this.listeners.forEach(listener => listener({
      canUndo: this.canUndo(),
      canRedo: this.canRedo(),
      historyLength: this.history.length
    }));
  }

  getHistory() {
    return this.history.map((item, index) => ({
      ...item,
      isCurrent: index === this.currentIndex
    }));
  }
}

export default UndoRedoManager;

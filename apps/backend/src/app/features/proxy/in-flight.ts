// How many AI requests each user has running on this server. Costs are
// recorded when a request ends, so without a cap one user could start many at
// once just under their limit and overshoot it by all of them together.
export class InFlightLimiter {
  private readonly running = new Map<string, number>();

  // True (and counted) if the user has room for one more; call release() after.
  tryAcquire(userId: string, max: number): boolean {
    const count = this.running.get(userId) ?? 0;
    if (count >= max) return false;
    this.running.set(userId, count + 1);
    return true;
  }

  release(userId: string) {
    const count = (this.running.get(userId) ?? 1) - 1;
    if (count > 0) this.running.set(userId, count);
    else this.running.delete(userId);
  }
}

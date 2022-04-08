class UtilHelper {
  private s4(): string {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }

  generate(): string {
    return `${this.s4()}${this.s4()}-${this.s4()}-${this.s4()}-${this.s4()}-${this.s4()}${this.s4()}${this.s4()}`;
  }

  arrayDistinct(data: any[]): any[] {
    return Array.from(new Set(data));
  }
}

export const utilHelp = new UtilHelper();

declare module "page-flip" {
  export interface FlipEvent {
    data: number | string | Record<string, unknown>;
    object: PageFlip;
  }

  export class PageFlip {
    constructor(element: HTMLElement, settings: Record<string, unknown>);
    loadFromHTML(items: NodeListOf<HTMLElement> | HTMLElement[]): void;
    destroy(): void;
    update(): void;
    flipNext(corner?: "top" | "bottom"): void;
    flipPrev(corner?: "top" | "bottom"): void;
    flip(page: number, corner?: "top" | "bottom"): void;
    getCurrentPageIndex(): number;
    on(event: string, cb: (e: FlipEvent) => void): PageFlip;
    off(event: string): void;
  }
}

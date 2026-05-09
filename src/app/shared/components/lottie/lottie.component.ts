import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LottieComponent as NgxLottieComponent, AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-lottie',
  standalone: true,
  imports: [NgxLottieComponent],
  template: `
    <ng-lottie
      [options]="options()"
      [width]="width()"
      [height]="height()"
      [class]="class()"
    ></ng-lottie>
  `,
  styles: [`
    :host {
      display: inline-block;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppLottieComponent {
  path = input.required<string>();
  width = input<string>('100%');
  height = input<string>('100%');
  loop = input<boolean>(true);
  autoplay = input<boolean>(true);
  class = input<string>('');

  options = () => ({
    path: this.path(),
    loop: this.loop(),
    autoplay: this.autoplay()
  } as AnimationOptions);
}

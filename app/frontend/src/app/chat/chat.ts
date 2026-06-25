import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-chat',
  imports: [],
  templateUrl: './chat.html',
  styleUrl: './chat.scss',
})
export class Chat {
  private readonly route = inject(ActivatedRoute);

  readonly caseId = toSignal(
    this.route.paramMap.pipe(map(params => params.get('caseId') ?? '')),
    { initialValue: '' }
  );
}


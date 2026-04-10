import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

interface RewardTile {
  id: string;
  src: string;
  alt: string;
}

@Component({
  selector: 'app-better-rewards',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './better-rewards.component.html',
  styleUrl: './better-rewards.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BetterRewardsComponent {
  private readonly tileRowSize = 11;
  private readonly tileImagePool: ReadonlyArray<string> = [
    'images/better-rewards.png',
    'images/Dischem-Logo.jpg',
    'images/Vector.png',
    'images/Group.png'
  ];

  readonly rowOneTiles: ReadonlyArray<RewardTile> = this.buildTileRow('row-1');
  readonly rowTwoTiles: ReadonlyArray<RewardTile> = this.buildTileRow('row-2');

  readonly rowOneLoopTiles: ReadonlyArray<RewardTile> = [...this.rowOneTiles, ...this.rowOneTiles];
  readonly rowTwoLoopTiles: ReadonlyArray<RewardTile> = [...this.rowTwoTiles, ...this.rowTwoTiles];

  constructor(private readonly router: Router) {}

  goBack(): void {
    this.router.navigate(['/landing-home']);
  }

  trackTile(index: number, tile: RewardTile): string {
    return `${tile.id}-${index}`;
  }

  private buildTileRow(rowKey: string): ReadonlyArray<RewardTile> {
    const offset = rowKey === 'row-1' ? 0 : 1;

    return Array.from({ length: this.tileRowSize }, (_, index) => ({
      id: `${rowKey}-${index}`,
      src: this.tileImagePool[(index + offset) % this.tileImagePool.length],
      alt: 'Better Rewards tile image'
    }));
  }
}

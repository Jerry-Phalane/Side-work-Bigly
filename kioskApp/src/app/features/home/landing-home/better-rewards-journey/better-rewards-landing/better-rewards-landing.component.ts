import { ChangeDetectionStrategy, Component, Output, EventEmitter } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface RewardTile {
  id: string;
  src: string;
  alt: string;
}

@Component({
  selector: 'app-better-rewards-landing',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './better-rewards-landing.component.html',
  styleUrl: './better-rewards-landing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BetterRewardsLandingComponent {
  private readonly tileRowSize = 11;
  private readonly tileImagePool: ReadonlyArray<string> = [
    'images/better-rewards.png',
    'images/Dischem-Logo.jpg',
    'images/Vector.png',
    'images/Group.png'
  ];

  readonly rowOneTiles: ReadonlyArray<RewardTile> = this.buildTileRow('row-1');
  readonly rowTwoTiles: ReadonlyArray<RewardTile> = this.buildTileRow('row-2');
  readonly rowOneLoopTiles: ReadonlyArray<RewardTile> = this.createLoopTiles(this.rowOneTiles);
  readonly rowTwoLoopTiles: ReadonlyArray<RewardTile> = this.createLoopTiles(this.rowTwoTiles);
  @Output() readonly next = new EventEmitter<void>();

  goToNextStep(): void {
    this.next.emit();
  }

  private buildTileRow(rowKey: string): ReadonlyArray<RewardTile> {
    const offset = rowKey === 'row-1' ? 0 : 1;
    return Array.from({ length: this.tileRowSize }, (_, index) => ({
      id: `${rowKey}-${index}`,
      src: this.tileImagePool[(index + offset) % this.tileImagePool.length],
      alt: 'Better Rewards tile image'
    }));
  }

  private createLoopTiles(tiles: ReadonlyArray<RewardTile>): ReadonlyArray<RewardTile> {
    return [
      ...tiles.map((tile) => ({ ...tile, id: `${tile.id}-a` })),
      ...tiles.map((tile) => ({ ...tile, id: `${tile.id}-b` }))
    ];
  }
}

use anchor_lang::prelude::*;
use instructions::*;
use state::game::Tile;

pub mod errors;
pub mod instructions;
pub mod state;

declare_id!("42mo47RQAEbdJME5ib5QGWBFJUW2ABBGcnrBxqnRMXRh");

#[program]
pub mod tic_tac_toe {
    use super::*;

    pub fn setup_game(ctx: Context<SetupGame>, player_two: Pubkey) -> Result<()> {
        setup_game::run(ctx, player_two)
    }

    pub fn play(ctx: Context<Play>, tile: Tile) -> Result<()> {
        play::run(ctx, tile)
    }
}

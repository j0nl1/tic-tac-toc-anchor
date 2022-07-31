use crate::errors::TicTacToeError;
use crate::state::game::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct Play<'info> {
    #[account(mut)]
    pub game: Account<'info, Game>,
    pub player: Signer<'info>,
}

pub fn run(ctx: Context<Play>, tile: Tile) -> Result<()> {
    let game = &mut ctx.accounts.game;
    require_keys_eq!(
        game.current_player(),
        ctx.accounts.player.key(),
        TicTacToeError::NotPlayersTurn
    );

    game.play(&tile)
}

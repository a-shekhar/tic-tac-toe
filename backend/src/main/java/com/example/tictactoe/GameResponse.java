package com.example.tictactoe;

public class GameResponse {
    private boolean success;
    private String message;
    private Game game;

    public GameResponse(boolean success, String message, Game game) {
        this.success = success;
        this.message = message;
        this.game = game;
    }
    public static GameResponse ok(String msg, Game g) { return new GameResponse(true, msg, g); }
    public static GameResponse fail(String msg) { return new GameResponse(false, msg, null); }

    public boolean isSuccess() { return success; }
    public String getMessage() { return message; }
    public Game getGame() { return game; }
}

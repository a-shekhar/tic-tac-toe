package com.example.tictactoe;

import java.util.NoSuchElementException;
import java.util.UUID;

import org.springframework.context.annotation.Bean;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

@RestController
@RequestMapping("/api/games")
public class GameController {

    private final GameService service;

    public GameController(GameService service) {
        this.service = service;
    }

    // CORS for dev
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:5173")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowCredentials(true);
            }
        };
    }

    @PostMapping
    public ResponseEntity<GameResponse> create() {
        Game g = service.createGame();
        return ResponseEntity.ok(GameResponse.ok("OK", g));
    }

    @GetMapping("/{id}")
    public ResponseEntity<GameResponse> get(@PathVariable("id") UUID id) {
        return ResponseEntity.ok(GameResponse.ok("OK", service.get(id)));
    }

    @PostMapping("/{id}/move")
    public ResponseEntity<GameResponse> move(@PathVariable("id") UUID id,
            @RequestBody MoveRequest body) {
        Game g = service.applyMove(id, body.getRow(), body.getCol());
        return ResponseEntity.ok(GameResponse.ok("OK", g));
    }

    @PostMapping("/{id}/cpu-move")
    public ResponseEntity<GameResponse> cpu(@PathVariable("id") UUID id) {
        Game g = service.cpuMove(id);
        return ResponseEntity.ok(GameResponse.ok("OK", g));
    }

    @PostMapping("/{id}/reset")
    public ResponseEntity<GameResponse> reset(@PathVariable("id") UUID id) {
        Game g = service.reset(id);
        return ResponseEntity.ok(GameResponse.ok("OK", g));
    }

    @ExceptionHandler({IllegalArgumentException.class, NoSuchElementException.class})
    public ResponseEntity<GameResponse> badRequest(Exception e) {
        return ResponseEntity.badRequest().body(GameResponse.fail(e.getMessage()));
    }
}

class MoveRequest {

    @Min(0)
    @Max(2)
    private int row;
    @Min(0)
    @Max(2)
    private int col;

    public MoveRequest() {
    }

    public int getRow() {
        return row;
    }

    public void setRow(int row) {
        this.row = row;
    }

    public int getCol() {
        return col;
    }

    public void setCol(int col) {
        this.col = col;
    }
}

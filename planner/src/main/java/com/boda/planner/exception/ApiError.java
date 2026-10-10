package com.boda.planner.exception;

import java.time.LocalDateTime;

public class ApiError {

    private LocalDateTime timestamp;
    private Integer status;
    private String message;
    private String path;

    public ApiError(Integer status, String message, String path) {
        this.timestamp = LocalDateTime.now();
        this.status = status;
        this.message = message;
        this.path = path;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public Integer getStatus() {
        return status;
    }

    public String getMessage() {
        return message;
    }

    public String getPath() {
        return path;
    }
}

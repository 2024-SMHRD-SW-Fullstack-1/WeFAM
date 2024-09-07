package com.izg.back_end.controller;

import com.izg.back_end.dto.NotificationDto;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;

@RestController
public class NotificationController {

    private final List<SseEmitter> clients = new CopyOnWriteArrayList<>();

    // SSE 연결 설정
    @GetMapping("/notifications")
    public SseEmitter subscribe() {
        SseEmitter emitter = new SseEmitter(60 * 1000L * 10); // 10분 타임아웃
        clients.add(emitter);

        emitter.onCompletion(() -> clients.remove(emitter));
        emitter.onTimeout(() -> {
            clients.remove(emitter);
            emitter.complete();
        });
        emitter.onError((e) -> {
            clients.remove(emitter);
            emitter.completeWithError(e);
        });

        return emitter;
    }

    // 쪽지 전송 API
    @PostMapping("/send-message")
    public void sendMessage(@RequestBody NotificationDto notification) {
        notification.setTime(LocalDateTime.now().toString()); // 현재 시간 설정

        // 실제 쪽지 전송 로직 (데이터베이스 저장 등)
        System.out.println("Message from " + notification.getSenderId() + " to " + notification.getReceiverId() + ": " + notification.getMessage());

        // 실시간 알림을 보내기 위한 SSE 전송
        sendNotification(notification);
    }

    // 알림을 연결된 클라이언트들에게 전송하는 메서드
    private void sendNotification(NotificationDto notification) {
        clients.forEach(emitter -> {
            try {
                System.out.println("알림을 전송합니다: " + notification); // 알림 전송 로그 추가
                emitter.send(SseEmitter.event()
                    .name("message")  // 이벤트 이름 지정
                    .data(notification));  // 데이터를 알림 DTO로 전송
            } catch (IOException e) {
                System.err.println("알림 전송 중 오류 발생: " + e.getMessage());
                emitter.completeWithError(e);
                clients.remove(emitter);
            }
        });
    }
}

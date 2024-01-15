CREATE TABLE BlogPost (
  post_id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  creation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  views INT DEFAULT 0,
  content LONGTEXT
);


CREATE TABLE CalendarEvent ( 
  event_id INT AUTO_INCREMENT PRIMARY KEY, 
  event_title VARCHAR(255) NOT NULL, 
  start_time DATETIME NOT NULL, 
  end_time DATETIME NOT NULL, 
  event_text LONGTEXT, 
  event_type varchar(255) NOT NULL,
  creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  update_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE User (
  email VARCHAR(255) NOT NULL PRIMARY KEY,
  username VARCHAR(255) NOT NULL
);

INSERT INTO User ( email, username) VALUES ('jsh021813@gmail.com', '정성훈');

INSERT INTO BlogPost ( title, content) VALUES ('테스트용 게시물 1', '안녕하세요 블로그 게시물 1번입니다.');
INSERT INTO BlogPost ( title, content) VALUES ('테스트용 게시물 2', '안녕하세요 블로그 게시물 2번입니다.');
INSERT INTO BlogPost ( title, content) VALUES ('테스트용 게시물 3', '안녕하세요 블로그 게시물 3번입니다.');

INSERT INTO CalendarEvent ( event_title, start_time, end_time, event_type) VALUES ('이벤트 1', '2024-01-01 00:00:00', '2024-01-01 00:01:01', '중요')
INSERT INTO CalendarEvent ( event_title, start_time, end_time, event_type) VALUES ('이벤트 2', '2024-01-02 00:00:00', '2024-01-02 00:02:01', '매우 중요')
INSERT INTO CalendarEvent ( event_title, start_time, end_time, event_type) VALUES ('이벤트 3', '2024-01-03 00:00:00', '2024-01-04 00:03:01', '평범')
INSERT INTO CalendarEvent ( event_title, start_time, end_time, event_type) VALUES ('이벤트 4', '2024-01-04 00:00:00', '2024-01-04 00:04:01', '중요')
INSERT INTO CalendarEvent ( event_title, start_time, end_time, event_type) VALUES ('이벤트 5', '2024-01-05 00:00:00', '2024-01-05 00:05:01', '매우 중요')
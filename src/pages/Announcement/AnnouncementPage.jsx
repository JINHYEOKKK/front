import React from 'react';
import './AnnouncementPage.css'; // 스타일링을 위한 CSS 파일을 사용

const AnnouncementPage = () => {
  const announcements = [
    {
      id: 1,
      category: '강아지',
      title: '입양하세요(로블)하시는분!!',
      author: '유명',
      time: '18시간 전',
      comments: 2,
      image: 'image-url-1.jpg',
    },
    {
      id: 2,
      category: '고양이',
      title: '유기묘 or 길냥이 돕는 방법',
      author: '푸딩애기',
      time: '22시간 전',
      comments: 0,
      image: 'image-url-2.jpg',
    },
    {
      id: 3,
      category: '고양이',
      title: '반려동물 캔들 써봤는데 넘 조아요',
      author: '여름겨울언저리',
      time: '1일 전',
      comments: 0,
      image: 'image-url-3.jpg',
    },
    // 더 많은 항목 추가 가능
  ];

  return (
    <div className="announcement-page">
      {announcements.map((announcement) => (
        <div key={announcement.id} className="announcement-card">
          <img src={announcement.image} alt={announcement.title} className="announcement-image" />
          <div className="announcement-content">
            <div className="announcement-header">
              <span className="category">{announcement.category}</span>
              <span className="author">{announcement.author}</span>
              <span className="time">{announcement.time}</span>
            </div>
            <h2 className="announcement-title">{announcement.title}</h2>
            <div className="announcement-footer">
              <span className="comments">댓글: {announcement.comments}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnnouncementPage;

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';
import {
  Container,
  Title,
  PostCard,
  PostImage,
  PostContent,
  PostHeader,
  PostTitle,
  PostAuthor,
  PostFooter,
  CommentsCount,
  WriteButton,
  Pagination,
  PageButton
} from './BoardStyles';

const BoardPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { boardType } = useParams();

  const postsPerPage = 10;

  useEffect(() => {
    fetchPosts(currentPage);
  }, [boardType, currentPage]);

  const fetchPosts = async (page) => {
    setLoading(true);

    try {
      const response = await axios.get(`http://localhost:8080/boards`, {
        params: {
          type: boardType,
          page: page,
          size: postsPerPage
        }
      });
  
      const formattedPosts = response.data.data.map(post => ({
        ...post,
        author: {
          ...post.author,
          nickname: post.author?.nickName || '익명'
        },
        viewCount: post.viewCount ?? 0,
        likesCount: post.likesCount ?? 0,
        boardStatus: post.boardStatus || '기본 상태'
      }));
  
      setPosts(formattedPosts);
      setTotalPages(response.data.pageInfo.totalPages || 1);
    } catch (error) {
      console.error('게시글을 불러오는데 실패했습니다:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const getBoardTitle = () => {
    switch(boardType) {
      case 'review': return '매칭 후기';
      case 'boast': return '자랑';
      case 'announcement': return '공지사항';
      case 'inquiry': return '신고/문의';
      default: return '게시판';
    }
  };

  const handleWriteClick = () => {
    if (isLoggedIn) {
      navigate(`/boards/${boardType}/write`);
    } else {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/login', { state: { from: `/boards/${boardType}` } });
    }
  };

  return (
    <Container>
      <Title>{getBoardTitle()}</Title>
      {loading ? (
        <p>게시글을 불러오는 중...</p>
      ) : posts.length > 0 ? (
        posts.map((post) => (
          <PostCard key={post.boardId} onClick={() => navigate(`/boards/${boardType}/${post.boardId}`)}>
            <PostImage src={post.contentImg || 'default-image-url.jpg'} alt={post.title} />
            <PostContent>
              <PostHeader>
                <PostTitle>{post.title}</PostTitle>
              </PostHeader>
              <PostAuthor>{post.author?.nickname}</PostAuthor>
              <PostFooter>
                <CommentsCount>댓글: {post.commentCount ?? 0}</CommentsCount>
              </PostFooter>
            </PostContent>
          </PostCard>
        ))
      ) : (
        <p>게시글이 없습니다.</p>
      )}
      {posts.length > 0 && (
        <Pagination>
          <PageButton onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
            이전
          </PageButton>
          {[...Array(totalPages).keys()].map(pageNumber => (
            <PageButton key={pageNumber + 1} onClick={() => setCurrentPage(pageNumber + 1)} active={currentPage === pageNumber + 1}>
              {pageNumber + 1}
            </PageButton>
          ))}
          <PageButton onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
            다음
          </PageButton>
        </Pagination>
      )}
      {boardType !== 'announcement' && (
        <WriteButton onClick={handleWriteClick}>글쓰기</WriteButton>
      )}
    </Container>
  );
};

export default BoardPage;

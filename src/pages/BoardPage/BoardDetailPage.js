import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { ClipLoader } from 'react-spinners';
import { Container, Title, Meta, Content, BackButton, Image, LikeButton, CommentSection, CommentInput, CommentSubmitButton } from './BoardStyles';

const BoardDetailPage = () => {
  const { boardType, boardId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const data = {
    comment
  
    // boardType은 이미 경로에 포함되어 있으므로 여기서 추가하지 않습니다.
  };

  const fetchPost = async () => {
    if (!boardId) {
      throw new Error('Invalid post ID');
    }
    try {
      const response = await axios.get(`http://localhost:8080/boards/${boardId}`);
      return response.data.data;
    } catch (error) {
      console.log('boardId:', boardId);
      throw error;
    }
  };

  const { data: post, isLoading, isError } = useQuery({
    queryKey: ['post', boardId],
    queryFn: fetchPost,
    enabled: !!boardId,
  });

  const likeMutation = useMutation({
    mutationFn: () => axios.post(`http://localhost:8080/boards/${boardId}/like`),
    onSuccess: () => {
      queryClient.invalidateQueries(['post', boardId]);
    },
  });

  const commentMutation = useMutation({
    mutationFn: (newComment) => axios.post(`http://localhost:8080/boards/${boardId}/comments`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['post', boardId]);
    },
  });

  const handleLike = () => {
    likeMutation.mutate();
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    const content = e.target.commentContent.value;
    if (content) {
      commentMutation.mutate({ content });
    }
  };

  if (isLoading) return (
    <Container>
      <ClipLoader color="#e57373" loading={isLoading} size={50} />
    </Container>
  );

  if (isError) return <div>게시글을 불러오는데 오류가 발생했습니다.</div>;

  if (!post) return <div>게시글을 찾을 수 없습니다.</div>;

  return (
    <Container>
      <Title>{post.title}</Title>
      <Meta>
        <span>작성자: {post.author || '알 수 없음'}</span>
        <span>조회수: {post.viewCount || 0}</span>
        <span>
          좋아요: {post.likesCount || 0}
          <LikeButton onClick={handleLike}>
            <FontAwesomeIcon icon={post.isLiked ? solidHeart : regularHeart} color={post.isLiked ? 'red' : 'gray'} />
          </LikeButton>
        </span>
      </Meta>
      <Content>{post.content}</Content>
      {post.contentImg && <Image src={post.contentImg} alt="게시글 이미지" />}
      
      <CommentSection>
        <h3>댓글</h3>
        {post.comments && post.comments.length > 0 ? (
          post.comments.map((comment) => (
            <div key={comment.commentId}>
              <p>{comment.comment}</p>
              <small>{comment.name || '알 수 없음'} - {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : '알 수 없음'}</small>
            </div>
          ))
        ) : (
          <p>아직 댓글이 없습니다.</p>
        )}
        <form onSubmit={handleCommentSubmit}>
          <CommentInput 
            name="commentContent"
            placeholder="댓글을 입력하세요"
          />
          <CommentSubmitButton type="submit">댓글 작성</CommentSubmitButton>
        </form>
      </CommentSection>

      <BackButton onClick={() => navigate(`/boards/${boardType}`)}>목록으로</BackButton>
    </Container>
  );
};

export default BoardDetailPage;

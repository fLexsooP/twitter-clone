import { useRouter } from 'next/router';
import { useCallback, useMemo } from 'react';
import { AiOutlineMessage, AiOutlineHeart } from 'react-icons/ai';
import { formatDistanceToNowStrict } from 'date-fns';

import useLoginModal from '@/hooks/useLoginModal';

import useCurrentUser from '../../hooks/useCurrentUser';
import Avatar from '../Avatar';

interface PostItemProps {
  data: Record<string, any>;
  userId?: string;
}

const PostItem: React.FC<PostItemProps> = ({ data, userId }) => {
  const router = useRouter();
  const loginModal = useLoginModal();

  const { data: currentUser } = useCurrentUser();

  const goToUser = useCallback(
    (event: any) => {
      event.stopPropagation();

      router.push(`/user/${data.user.id}`);
    },
    [router, data.user.id]
  );

  const goToPost = useCallback(
    (event: any) => {
      router.push(`/posts/${data.id}`);
    },
    [router, data.id]
  );

  const onLike = useCallback(
    (event: any) => {
      event.stopPropagation();
      loginModal.onOpen();
    },
    [loginModal]
  );

  const createdAt = useMemo(() => {
    if (!data?.createdAt) {
      return null;
    }
    return formatDistanceToNowStrict(new Date(data.createdAt));
  }, [data?.createdAt]);

  return (
    <div
      onClick={goToPost}
      className="
        border-b-[1px]
        border-neutral-800
        p-5
        cursor-pointer
        hover:bg-neutral-900
        transition
    ">
      <div className="flex flex-row items-start gap-3">
        {/* Post user */}
        <Avatar userId={data.user.id} />
        <div className="flex flex-col flex-1">
          <div className="flex flex-row items-center gap-2">
            <p
              onClick={goToUser}
              className="
                text-white
                font-semibold
                cursor-pointer
                hover:underline
            ">
              {data.user.name}
            </p>
            <span
              onClick={goToUser}
              className="
                text-neutral-500
                cursor-pointer
                hover:underline
                hidden
                md:block
            ">
              @{data.user.username}
            </span>
            <span className="text-neutral-500 text-sm">{createdAt}</span>
          </div>

          {/* Post body */}
          <div className="text-white mt-1">{data.body}</div>

          {/* Comments and likes */}
          <div className="flex flex-row items-center mt-3 gap-10">
            {/* Comments */}
            <div
              className="
                flex
                flex-row
                items-center
                text-neutral-500
                gap-2
                cursor-pointer
                transition
                hover:text-sky-500
            ">
              <AiOutlineMessage size={20} />
              <p>{data.comments?.length || 0}</p>
            </div>
            {/* Likes */}
            <div
              onClick={onLike}
              className="
                flex
                flex-row
                items-center
                text-neutral-500
                gap-2
                cursor-pointer
                transition
                hover:text-red-500
            ">
              <AiOutlineHeart />
              <p>{data.likedIds.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostItem;

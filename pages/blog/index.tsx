import { GetStaticProps } from "next";
import { getAllPosts, Post } from "../../lib/posts";

interface PageProps {
  allPosts: Post[];
}

const Index: React.FC<PageProps> = ({ allPosts }) => {
  return <div>{allPosts.map(Post)}</div>;
};

const Post: React.FC<Post> = (post) => {
  return (
    <div key={post.slug}>
      <h2>{post.title}</h2>
      <div className="thumbnails">
        {post.photos.map((photo, index) => (
          <img src={photo.absoluteUrl} className="thumbnail" key={index} />
        ))}
      </div>
      <p>{post.content}</p>
    </div>
  );
};

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  return {
    props: {
      allPosts: getAllPosts(),
    },
  };
};

export default Index;

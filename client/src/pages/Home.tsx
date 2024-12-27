import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import trending from "../assets/trending.svg";
import search from "../assets/search.svg";
import { PostCard, Loader } from "../components";

// Define the props interface for the Home component
interface HomeProps {
  text: string;
}

// Define the structure of a post
interface Post {
  _id: string;
  name: string;
  prompt: string;
  photo: string; // Ensure this property exists
}

// Define the Home component
const Home: React.FC<HomeProps> = ({ text }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [searchResult, setSearchResult] = useState<Post[]>([]);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);

      try {
        const response = await fetch(`${import.meta.env.VITE_REACT_URL}/api/post`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const result = await response.json();
          setAllPosts(result.data.reverse());
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (searchTimeout) clearTimeout(searchTimeout);
    const value = e.target.value;
    setSearchText(value);

    setSearchTimeout(
      setTimeout(() => {
        const searchResults = allPosts.filter(
          (item) =>
            item.name.toLowerCase().includes(value.toLowerCase()) ||
            item.prompt.toLowerCase().includes(value.toLowerCase())
        );
        setSearchResult(searchResults);
      }, 500)
    );
  };

  if (loading) return <Loader />;

  return (
    <section className="p-5 pt-0 lg:p-10 lg:pt-10 max-w-7xl mx-auto xl:w-available lg:w-full overflow-scroll no_scroll w-screen lg:h-responsive_height h-full_image">
      <div className="max-w-7xl mx-auto font-medium flex items-center justify-between">
        <h1 className="text-4xl leading-relaxed">{text}</h1>

        <Link
          to="/create"
          className="px-4 hidden cursor-pointer py-2 bg-lighter hover:bg-hover/50 rounded-full lg:flex items-center gap-2 w-max"
        >
          <img src={trending} alt="Add" className="w-5 h-5" /> <span>Add</span>
        </Link>
      </div>

      {/* Search bar with icon */}
      <div className="w-full flex gap-2 items-center rounded-lg bg-lighter p-3 mt-2 outline-none border-none">
        <label htmlFor="search">
          <img src={search} alt="search" className="w-5" />
        </label>
        <input
          id="search"
          type="text"
          value={searchText}
          onChange={handleChange}
          placeholder="Search Community"
          className="w-full rounded-lg bg-lighter outline-none border-none"
        />
      </div>

      {allPosts.length > 0 && (
        <div className="py-10 grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 place-items-center gap-4">
          {(searchText ? searchResult : allPosts).map((post) => (
            <PostCard key={post._id} {...post} />
          ))}
        </div>
      )}
    </section>
  );
};

export default Home;
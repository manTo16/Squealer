import Feed from "@components/Feed/Feed";
import { useParams } from "react-router-dom";


export default function FeedWithQuery() {
    const { keyword } = useParams<{keyword: string}>();
    return <Feed searchQuery={keyword} searchRoute='/search/byKeyword/' />;
  }
  
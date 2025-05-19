import {
  View,
  Text,
  FlatList,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useAuthStore } from "../../store/authStore";
import styles from "../../assets/styles/home.styles";
import { useEffect, useState } from "react";
import { Image } from "expo-image";
import Ionicons from "@expo/vector-icons/Ionicons";
import COLORS from "../../constants/colors";
import { formatPublishDate } from "../../lib/utils";
import Loader from "../../components/Loader";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const Home = () => {
  const { token } = useAuthStore();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchBooks = async (pageNum = 1, refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else if (pageNum === 1) {
        setLoading(true);
      }

      const response = await fetch(
        `https://bookworm-backend-jlq2.onrender.com/api/v1/books?page=${pageNum}&limit=5`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        // setBooks((prevBooks) => [...prevBooks, ...data.books]);

        const uniqueBooks =
          refresh || pageNum === 1
            ? data.books
            : Array.from(
                new Set([...books, ...data.books].map((book) => book._id))
              ).map((id) =>
                [...books, ...data.books].find((book) => book._id === id)
              );

        setBooks(uniqueBooks);

        setHasMore(pageNum < data.totalPages);
        setPage(pageNum);
      } else {
        Alert.alert("Error", "Failed to fetch books.");
      }
    } catch (error) {
      console.log("Error fetching books:", error);
      Alert.alert("Error", "An error occurred while fetching books.");
    } finally {
      if (refresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleloadMore = async () => {
    if (hasMore && !loading && !refreshing) {
      await sleep(100); // Simulate network delay
      await fetchBooks(page + 1);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.bookCard}>
        <View style={styles.bookHeader}>
          <View style={styles.userInfo}>
            <Image
              source={{ uri: item.user.profileImage }}
              style={styles.avatar}
            />
            <Text style={styles.username}>{item.user.username}</Text>
          </View>
        </View>

        <View style={styles.bookImageContainer}>
          <Image
            source={item.image}
            style={styles.bookImage}
            contentFit="cover"
          />
        </View>

        <View style={styles.bookDetails}>
          <Text style={styles.bookTitle}>{item.title}</Text>
          <View style={styles.ratingContainer}>
            {renderRatingStars(item.rating)}
          </View>
          <Text style={styles.caption}>{item.caption}</Text>
          <Text style={styles.date}>
            Shared on {formatPublishDate(item.createdAt)}
          </Text>
        </View>
      </View>
    );
  };

  const renderRatingStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={14}
          color={i <= rating ? "#f4b400" : COLORS.textSecondary}
          style={{ marginRight: 2 }}
        />
      );
    }
    return stars;
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchBooks(1, true)}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        onEndReached={handleloadMore}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>BookWorm 🐛</Text>
            <Text style={styles.headerSubtitle}>
              Discover new reads from our community 🌼
            </Text>
          </View>
        }
        ListFooterComponent={
          hasMore && books.length > 0 ? (
            <ActivityIndicator
              style={styles.footerLoader}
              size="small"
              color={COLORS.primary}
            />
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="book-outline"
              size={60}
              color={COLORS.textSecondary}
            />
            <Text style={styles.emptyText}>No recommendations yet!</Text>
            <Text style={styles.emptySubtext}>
              Be the first to share your favorite book! 📚
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default Home;

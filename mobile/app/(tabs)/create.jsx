import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import styles from "../../assets/styles/create.styles";
import COLORS from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { useAuthStore } from "@/store/authStore";
import { useBookStore } from "../../store/bookStore";

const create = () => {
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [rating, setRating] = useState(3);
  const [imageBase64, setImageBase64] = useState(null);
  const [loading, setLoading] = useState(false);

  const { addBook } = useBookStore();
  const router = useRouter();

  const pickImage = async () => {
    try {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Sorry, we need camera roll permissions to make this work!"
          );
          return;
        }

        //launch image library
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: "images",
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.5,
          base64: true,
        });
        if (!result.canceled) {
          const selectedImage = result.assets[0].uri;
          setImage(selectedImage);

          if (result.assets[0].base64) {
            setImageBase64(result.assets[0].base64);
          } else {
            const base64 = await FileSystem.readAsStringAsync(
              result.assets[0].uri,
              {
                encoding: FileSystem.EncodingType.Base64,
              }
            );
            setImageBase64(base64);
          }
        } else {
          Alert.alert("No image selected", "Please select an image to upload.");
        }
      }
    } catch (error) {
      console.log("Error picking image: ", error);
      Alert.alert(
        "Error",
        "An error occurred while picking the image. Please try again."
      );
    }
  };

  // const handleSubmit = async () => {
  //   if (!title || !caption || !imageBase64) {
  //     Alert.alert("Please fill in all fields and select an image.");
  //     // return;
  //   }

  //   try {
  //     setLoading(true);
  //     const uriParts = image.split(".");
  //     const fileType = uriParts[uriParts.length - 1];
  //     const imageType = fileType
  //       ? `image/${fileType.toLowerCase()}`
  //       : "image/jpeg";

  //     const imageDataUrl = `data:${imageType};base64,${imageBase64}`;

  //     const bookData = {
  //       title,
  //       caption,
  //       rating,
  //       image: imageDataUrl,
  //     };
  //     console.log("Book data: ", bookData);

  //     const result = await addBook(bookData);

  //     console.log("Result: ", result);

  //     if (result.success) {
  //       Alert.alert("Success", "Book recommendation added successfully!");
  //       router.push("/(tabs)");
  //       setTitle("");
  //       setCaption("");
  //       setImage(null);
  //       setImageBase64(null);
  //       setRating(3);
  //     } else {
  //       Alert.alert(
  //         "Error",
  //         result.error || "An error occurred while adding the book."
  //       );
  //     }
  //   } catch (error) {
  //     console.log("Error adding book:", error);
  //     Alert.alert(
  //       "Error",
  //       "An error occurred while adding the book. Please try again."
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async () => {
    if (!title || !caption || !image) {
      Alert.alert(
        "Invalid Details",
        "Please fill in all fields and select an image."
      );
      return;
    }

    try {
      setLoading(true);

      // Extract image type
      const uriParts = image.split(".");
      const fileType = uriParts[uriParts.length - 1];

      // Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", {
        uri: image,
        name: `upload.${fileType}`,
        type: `image/${fileType}`,
      });
      formData.append("upload_preset", "au2ty08i"); // 👈 update this

      const cloudinaryRes = await fetch(
        "https://api.cloudinary.com/v1_1/dyjl9bwpv/image/upload", // 👈 update this
        {
          method: "POST",
          body: formData,
        }
      );

      const cloudData = await cloudinaryRes.json();

      if (!cloudinaryRes.ok) {
        console.error("Cloudinary error:", cloudData);
        throw new Error("Image upload failed");
      }

      const imageUrl = cloudData.secure_url;

      // Submit form to your backend
      const bookData = {
        title,
        caption,
        rating,
        image: imageUrl,
      };
      console.log("Book data: ", bookData);

      const result = await addBook(bookData);

      console.log("Result: ", result);

      if (result.success) {
        Alert.alert("Success", "Book recommendation added successfully!");
        router.push("/(tabs)");
        setTitle("");
        setCaption("");
        setImage(null);
        setImageBase64(null);
        setRating(3);
      } else {
        Alert.alert(
          "Error",
          result.error || "An error occurred while adding the book."
        );
      }
    } catch (error) {
      console.log("Error adding book:", error);
      Alert.alert(
        "Error",
        "An error occurred while adding the book. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const renderRatingPicker = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => setRating(i)}
          style={styles.starButton}
        >
          <Ionicons
            name={i <= rating ? "star" : "star-outline"}
            size={32}
            color={i <= rating ? "#f4b400" : COLORS.textSecondary}
          />
        </TouchableOpacity>
      );
    }
    return <View style={styles.ratingContainer}>{stars}</View>;
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      style={styles.scrollViewStyle}
    >
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Add Book Recommendations</Text>
          <Text style={styles.subtitle}>
            Share your favourite reads with the community!
          </Text>
        </View>
        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Book Title</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="book-outline"
                size={20}
                color={COLORS.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="Enter book title"
                placeholderTextColor={COLORS.placeholderText}
                value={title}
                onChangeText={setTitle}
                style={styles.input}
              />
            </View>
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Rating</Text>
            {renderRatingPicker()}
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Book Image</Text>
            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
              {image ? (
                <Image source={{ uri: image }} style={styles.previewImage} />
              ) : (
                <View style={styles.placeholderContainer}>
                  <Ionicons
                    name="image-outline"
                    size={50}
                    color={COLORS.textSecondary}
                  />
                  <Text style={styles.placeholderText}>
                    Tap to select an image
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Caption</Text>
            <TextInput
              placeholder="Write your review or thoughts about this book"
              placeholderTextColor={COLORS.placeholderText}
              value={caption}
              onChangeText={setCaption}
              style={styles.textArea}
              multiline
            />
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              handleSubmit();
            }}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <>
                <Ionicons
                  name="cloud-upload-outline"
                  size={20}
                  color={COLORS.white}
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>Share</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default create;

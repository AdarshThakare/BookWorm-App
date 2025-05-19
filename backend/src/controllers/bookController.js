import cloudinary from "../lib/cloudinary.js";
import Book from "../models/Book.js";

// export const addBook = async (req, res) => {
//   try {
//     const { title, caption, rating, image } = req.body;
//     if (!title || !caption || !rating || !image) {
//       return res.status(400).json({ message: "Please fill all fields" });
//     }

//     //upload image to cloudinary
//     const uploadResponse = await cloudinary.uploader.upload(image);
//     const imageUrl = uploadResponse.secure_url;

//     //save to mongoDB
//     const newbook = new Book({
//       title,
//       caption,
//       image: imageUrl,
//       rating,
//       user: req.user._id, //user info in req.user
//     });

//     await newbook.save();

//     res.status(201).json(newbook);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

export const addBook = async (req, res) => {
  try {
    const { title, caption, rating, image } = req.body;

    if (!title || !caption || !rating || !image) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    // Basic validation for image URL
    if (!image.startsWith("http")) {
      return res.status(400).json({ message: "Invalid image URL" });
    }

    // Save book with image URL directly
    const newBook = new Book({
      title,
      caption,
      image, // This is now a Cloudinary URL from frontend
      rating,
      user: req.user._id,
    });

    await newBook.save();

    res.status(201).json(newBook);
  } catch (error) {
    console.error("Error in addBook:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getBooks = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 5;
    const skip = (page - 1) * limit;

    const books = await Book.find()
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit)
      .populate("user", "username profileImage")
      .exec();

    const totalBooks = await Book.countDocuments();

    res.send({
      books,
      currentPage: page,
      totalBooks,
      totalPages: Math.ceil(totalBooks / limit),
    });
    res.status(200).json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Check if the user is the owner of the book
    if (book.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this book" });
    }

    //delete image from cloudinary as well
    if (book.image & book.image.includes("cloudinary")) {
      try {
        const publicId = book.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        console.error("Error deleting image from Cloudinary:", error);
      }
    }

    await book.deleteOne();
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const myBook = async (req, res) => {
  try {
    const books = await Book.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

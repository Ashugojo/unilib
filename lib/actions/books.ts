"use server"

import {db} from "@/database/drizzle"
import {eq} from "drizzle-orm"
import {books, borrowRecords} from "@/database/schema"
import dayjs from "dayjs"

export const borrowBook = async (params: BorrowBookParams) => {
  const {userId, bookId} = params

  try {
    const book = await db
      .select({availableCopies: books.availableCopies})
      .from(books)
      .where(eq(books.id, bookId))
      .limit(1)

    if (!book.length || book[0].availableCopies <= 0) {
      return {
        success: false,
        error: "Book is not available for borrowing",
      }
    }

    const dueDate = dayjs().add(7, "days").toDate()

    // ✅ INSERT with RETURNING plain fields
    const [record] = await db
      .insert(borrowRecords)
      .values({
        userId,
        bookId,
        dueDate,
        status: "BORROWED",
      })
      .returning({
        id: borrowRecords.id,
        userId: borrowRecords.userId,
        bookId: borrowRecords.bookId,
        dueDate: borrowRecords.dueDate,
        status: borrowRecords.status,
        createdAt: borrowRecords.createdAt,
      })

    // ✅ UPDATE book copy count
    await db
      .update(books)
      .set({availableCopies: book[0].availableCopies - 1})
      .where(eq(books.id, bookId))

    return {
      success: true,
      data: record, // already plain, no need to stringify
    }
  } catch (error) {
    console.error("BorrowBook error:", error)

    return {
      success: false,
      error: "An error occurred while borrowing the book",
    }
  }
}

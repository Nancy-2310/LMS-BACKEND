import fs from 'fs/promises';
import path from 'path';

import cloudinary from 'cloudinary';

import asyncHandler from '../Middlewares/asyncHandler.middleware.js';
import Course from '../Models/course.model.js';
import AppError from '../utils/error.util.js';


/**
 * @ALL_COURSES
 * @ROUTE @GET {{URL}}/api/v1/courses
 * @ACCESS Public
 */

export const getAllCourses = asyncHandler(async (_req, res, next) => {
    // Find all the courses without lectures
    const courses = await Course.find({}).select('-lectures');
  
    res.status(200).json({
      success: true,
      message: 'All courses',
      courses,
    });
  });

  /**
 * @CREATE_COURSE
 * @ROUTE @POST {{URL}}/api/v1/courses
 * @ACCESS Private (admin only)
 */

  export const createCourse = asyncHandler(async (req, res, next) => {
    const { title, description, category, createdBy } = req.body;
  
    if (!title || !description || !category || !createdBy) {
      return next(new AppError('All fields are required', 400));
    }
  
    const course = await Course.create({
      title,
      description,
      category,
      createdBy,
    });
  
    if (!course) {
      return next(
        new AppError('Course could not be created, please try again', 400)
      );
    }
  
    // Run only if user sends a file
    if (req.file) {
      try {
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: 'lms', // Save files in a folder named lms
        });
  
        // If success
        if (result) {
          // Set the public_id and secure_url in array
          course.thumbnail.public_id = result.public_id;
          course.thumbnail.secure_url = result.secure_url;
        }
  
        // After successful upload remove the file from local storage
        fs.rm(`uploads/${req.file.filename}`);
      } catch (error) {
        // Empty the uploads directory without deleting the uploads directory
        for (const file of await fs.readdir('uploads/')) {
          await fs.unlink(path.join('uploads/', file));
        }
  
        // Send the error message
        return next(
          new AppError(
            JSON.stringify(error) || 'File not uploaded, please try again',
            400
          )
        );
      }
    }
  
    // Save the changes
    await course.save();
  
    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      course,
    });
  });
  

/**
 * @GET_LECTURES_BY_COURSE_ID
 * @ROUTE @POST {{URL}}/api/v1/courses/:id
 * @ACCESS Private(ADMIN, subscribed users only)
 */

export const getLecturesByCourseId = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const course = await Course.findById(id);

    if(!course) {
        return next(new AppError("No courses found with that ID", 404));
    }
    res.status(200).json({
        success: true,
        message: 'Course lectures fetched successfully',
        lectures: course.lectures,

    });
    });
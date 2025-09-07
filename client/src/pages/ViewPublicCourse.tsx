import Header from "@/components/Header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePublicCourses } from "@/hooks/usePublicCourses";
import type { ICourse, ILecture } from "@/types/apiResponseTypes";
import axios from "axios";
import { Award, BookOpen, Clock, IndianRupee, MessageCircle, PlayCircle, Star, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setLectures as setLecturesAction } from "@/redux/reducer/lecture.reducer";

const ViewPublicCourse = () => {
  const [selectedLecture, setSelectedLecture] = useState(0);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const { courseId } = useParams();
  const [course, setCourse] = useState<ICourse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [lectures, setLectures] = useState<ILecture[]>([]);
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false);
  const publicCourses = usePublicCourses()
  const [instructorCourses, setInstructorCourses] = useState<ICourse[]>([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth)
  const { reviews: courseReviews } = useSelector((state: RootState) => state.review)
  const userId = user?._id

  const filteredReviews = courseReviews?.filter((review) => review.course === courseId)
  // console.log("filteredReviews", filteredReviews)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [courseId]);


  const calculateAvgReview = () => {
    const totalReviews = course?.reviews?.length || 0;
    const totalRating = course?.reviews?.reduce((acc, review) => acc + review.rating, 0) || 0;
    return totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : "0.0";
  }

  const reviewHandler = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URI}/api/review/create`, { courseId, rating, comment: review }, {
        withCredentials: true
      })
      if (response.data.success) {
        toast.success("Review added successfully")
      } else {
        console.error("Error adding review:", response.data.message);
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error("Error adding review:", error);
      toast.error("Failed to add review")
    } finally {
      setRating(0)
      setReview("")
    }
  }

  const getCourseById = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URI}/api/course/${courseId}`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true
      });
      if (response.data.success) {
        setCourse(response.data.data)
      } else {
        console.error("Error fetching course:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching course:", error);
    }
    setLoading(false);
  };

  const getLecturesByCouresId = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URI}/api/lecture/course-lectures/${courseId}`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true
      });
      if (response.data.success) {
        setLectures(response.data.data)
        dispatch(setLecturesAction(response.data.data))
      } else {
        console.error("Error fetching lectures:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching lectures:", error);
    }
    setLoading(false);
  }

  useEffect(() => {
    getCourseById();
    getLecturesByCouresId();
  }, [courseId]);

  useEffect(() => {
    const getInstructorCourses = () => {
      const instructorCourses = publicCourses?.filter((courses) => courses.creator === course?.creator._id);
      setInstructorCourses(instructorCourses!);
    }
    getInstructorCourses();
  }, [publicCourses, course]);

  const handleEnroll = async (userId: string, courseId: string) => {
    setLoading(true);
    try {
      const order = await axios.post(`${import.meta.env.VITE_SERVER_URI}/api/order/razorpay-order`, { userId, courseId }, {
        withCredentials: true
      })
      console.log("order", order)
      if (order.data.success) {
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: order.data.data.amount,
          currency: "INR",
          name: "LMS",
          description: "Course enrollment payment",
          order_id: order.data.data.id,
          handler: async function (response: any) {
            try {
              const razorpayOrderId = response?.razorpay_order_id
              const verifyPayment = await axios.post(`${import.meta.env.VITE_SERVER_URI}/api/order/verify-payment`, { userId, courseId, razorpayOrderId }, {
                withCredentials: true
              })
              if (verifyPayment.data.success) {
                setIsEnrolled(true)
                toast.success("Payment verified successfully")
              }
              console.log("verifyPayment", verifyPayment)
            } catch (error) {
              console.log("Error verifying payment:", error)
            }
          }
        }
        const Razorpay = (window as any).Razorpay
        const rzp = new Razorpay(options)
        rzp.open()
      }
    } catch (error) {
      console.log("Error enrolling in course:", error);
      toast.error("Error while enrolling in course")
    }
    finally {
      setLoading(false);
    }
  }

  const checkEnrollment = () => {
    const enrolled = user?.enrollCourses.some(
      (enrolledCourseId) => enrolledCourseId.toString() === course?._id.toString()
    )
    setIsEnrolled(enrolled!)
  }

  useEffect(() => {
    checkEnrollment()
  }, [user, course])

  const renderStars = (rating: number, interactive = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= rating
              ? "fill-yellow-500 text-yellow-500"
              : "text-muted-foreground"
              } ${interactive ? "cursor-pointer hover:text-yellow-500" : ""}`}
            onClick={() => interactive && onRate && onRate(star)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Section 1: Course Details */}
      <section className="bg-course-header border-b max-w-7xl mx-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{course?.level}</Badge>
                </div>

                <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
                  {course?.title}
                </h1>

                <p className="text-xl text-muted-foreground">
                  {course?.subTitle}
                </p>

                <p className="text-lg text-muted-foreground">
                  {course?.description}
                </p>

                <p className="text-sm text-muted-foreground px-2 py-1 rounded-full bg-muted w-fit">
                  {course?.category}
                </p>

                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{calculateAvgReview()}</span>
                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    <span>({calculateAvgReview()} ratings)</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{course?.enrolledStudents.length.toLocaleString()} students</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>24 available</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={course?.creator?.photoUrl} />
                    <AvatarFallback>{course?.creator?.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Created by {course?.creator?.name}</p>
                    <p className="text-sm text-muted-foreground">{course?.creator?.email}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardContent className="p-6">
                  <div className="aspect-video mb-4 rounded-lg overflow-hidden">
                    <img
                      src={course?.thumbnail}
                      alt={course?.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold flex items-center gap-1">
                        <IndianRupee />{course?.price}
                      </span>
                      <Badge variant="destructive">0 % off</Badge>
                    </div>

                    {
                      isEnrolled ? (
                        <Button
                          disabled={!userId || !courseId || loading}
                          onClick={() => navigate(`/view-lectures/${courseId}`)}
                          className="w-full cursor-pointer hover:bg-primary/80"
                          size="lg">
                          Watch Now
                        </Button>
                      ) : (
                        <Button
                          disabled={!userId || !courseId || loading}
                          onClick={() => handleEnroll(userId!, courseId!)}
                          className="w-full cursor-pointer hover:bg-primary/80"
                          size="lg">
                          Enroll Now
                        </Button>
                      )
                    }
                    <div className="pt-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>30-day money-back guarantee</span>
                        <Award className="w-4 h-4 text-success" />
                      </div>
                      <div className="flex justify-between">
                        <span>Full lifetime access</span>
                        <BookOpen className="w-4 h-4 text-info" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Section 2: Curriculum */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Course Curriculum</h2>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    Lecture
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {lectures.map((lecture, index) => (
                        <div
                          key={lecture._id}
                          className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors
                              ${selectedLecture === index ? "bg-primary/10" : "hover:bg-muted/50"}
                            `}
                          onClick={() => {
                            setSelectedLecture(index)
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <PlayCircle className="w-5 h-5 text-primary" />
                            <span className={lecture?.isPreviewFree ? "line-through text-muted-foreground" : ""}>
                              {lecture?.lectureTitle}
                            </span>
                            {lecture?.isPreviewFree && (
                              <Badge variant="outline" className="text-xs">Free Lecture</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardContent className="">
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
                    {
                      lectures[selectedLecture]?.isPreviewFree ? (
                        <video src={lectures[selectedLecture]?.videoUrl} controls className="w-full h-full rounded-lg" />
                      ) : (
                        <PlayCircle className="w-16 h-16 text-primary" />
                      )
                    }
                  </div>
                  <h3 className="font-semibold mb-2">{lectures[selectedLecture]?.lectureTitle}</h3>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Section 3: Reviews */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Student Reviews</h2>

          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Add Your Review</CardTitle>
                  <CardDescription>Share your experience with other students</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Rating</label>
                    {renderStars(rating, true, setRating)}
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Review</label>
                    <textarea
                      className="w-full p-3 border rounded-lg resize-none"
                      rows={4}
                      placeholder="Write your review here..."
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                    />
                  </div>

                  <Button className="w-full cursor-pointer hover:bg-primary/80" type="submit" onClick={() => reviewHandler()}>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Submit Review
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4 overflow-y-auto h-[400px] scrollbar-hide">
              {filteredReviews?.map((review) => (
                <Card key={review._id}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage src={review.user?.photoUrl} />
                        <AvatarFallback>{review.user?.name.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{review.user?.name}</h4>
                          <span className="text-xs text-muted-foreground">
                            {(() => {
                              const reviewDate = new Date(review.reviewDate);
                              const now = new Date();
                              const diffMs = now.getTime() - reviewDate.getTime();
                              const diffWeeks = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7));

                              return diffWeeks === 0
                                ? "This week"
                                : `${diffWeeks} week${diffWeeks > 1 ? "s" : ""} ago`;
                            })()}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                          {renderStars(review.rating)}
                        </div>

                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4: Instructor Details */}
        <section>
          <h2 className="text-2xl font-bold mb-6">About the Instructor</h2>

          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-start gap-6">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={course?.creator?.photoUrl} />
                  <AvatarFallback>{course?.creator?.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{course?.creator?.name}</h3>
                  <p className="text-muted-foreground mb-4">{course?.creator?.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{instructorCourses.length}</div>
                      <div className="text-sm text-muted-foreground">Courses</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{(course?.creator?.students / 1000).toFixed(0)}k</div>
                      <div className="text-sm text-muted-foreground">Students</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">8+</div>
                      <div className="text-sm text-muted-foreground">Years Experience</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div>
            <h3 className="text-xl font-semibold mb-4">More Courses by {course?.creator?.name}</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {instructorCourses.map((course) => (
                <Card key={course._id} className="hover-scale cursor-pointer">
                  <CardContent className="p-4">
                    <div className="aspect-video mb-4 rounded-lg overflow-hidden">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <h4 className="font-semibold mb-2 line-clamp-2">{course.title}</h4>
                    <p className="text-xs bg-primary/10 mb-2 px-2 py-1 rounded-full w-fit">{course.category}</p>
                    <p className="text-muted-foreground mb-2 line-clamp-2">{course.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold flex items-center">
                        <IndianRupee className="w-4 h-4" /> {course.price}
                      </span>
                      <Button variant="outline" size="sm" onClick={() => navigate(`/course/${course._id}`)}>View Course</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ViewPublicCourse;  
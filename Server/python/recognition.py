import face_recognition
import os
import sys


# ==================== KNOWN FACES ====================

KNOWN_FACES_FOLDER = os.path.join(
    os.path.dirname(__file__),
    "known_faces"
)


def load_known_faces():
    known_face_encodings = []
    known_face_names = []

    for filename in os.listdir(KNOWN_FACES_FOLDER):

        image_path = os.path.join(
            KNOWN_FACES_FOLDER,
            filename
        )

        # Only process image files
        if not filename.lower().endswith(
            (".jpg", ".jpeg", ".png")
        ):
            continue

        try:
            image = face_recognition.load_image_file(
                image_path
            )

            face_encodings = face_recognition.face_encodings(
                image
            )

            if len(face_encodings) == 0:
                print(
                    f"No face found in: {filename}"
                )
                continue

            # Use the first detected face
            known_face_encodings.append(
                face_encodings[0]
            )

            # Remove file extension
            name = os.path.splitext(filename)[0]

            known_face_names.append(name)

            print(
                f"Loaded face: {name}"
            )

        except Exception as error:
            print(
                f"Error loading {filename}: {error}"
            )

    return known_face_encodings, known_face_names


# ==================== RECOGNIZE FACE ====================

def recognize_face(image_path):

    known_face_encodings, known_face_names = load_known_faces()

    if len(known_face_encodings) == 0:
        return "No known faces available"

    try:
        unknown_image = face_recognition.load_image_file(
            image_path
        )

        unknown_face_encodings = face_recognition.face_encodings(
            unknown_image
        )

        if len(unknown_face_encodings) == 0:
            return "No face detected"

        unknown_encoding = unknown_face_encodings[0]

        matches = face_recognition.compare_faces(
            known_face_encodings,
            unknown_encoding
        )

        face_distances = face_recognition.face_distance(
            known_face_encodings,
            unknown_encoding
        )

        best_match_index = face_distances.argmin()

        if matches[best_match_index]:
            return known_face_names[best_match_index]

        return "Unknown person"

    except Exception as error:
        return f"Recognition error: {error}"


# ==================== MAIN ====================

if __name__ == "__main__":

    if len(sys.argv) < 2:
        print("Please provide an image path.")
        sys.exit(1)

    image_path = sys.argv[1]

    result = recognize_face(image_path)

    print(f"RESULT: {result}")
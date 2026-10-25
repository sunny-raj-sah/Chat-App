 
// //  const Message = ({
// //   message,
// //   currentUser,
// //   onDelete,
// // }) => {
// //   const isOwn =
// //     message.sender?._id ===
// //     currentUser._id;

// //   const handleDelete = () => {
// //     if (!isOwn) {
// //       return;
// //     }

// //     const confirmed = window.confirm(
// //       "Are you sure you want to delete this message?"
// //     );

// //     if (!confirmed) {
// //       return;
// //     }

// //     onDelete(message._id);
// //   };

// //   return (
// //     <div
// //       className={`message-row ${
// //         isOwn ? "own" : "other"
// //       }`}
// //     >
// //       <div
// //         className={`message-bubble ${
// //           isOwn ? "own" : "other"
// //         }`}
// //       >
// //         <div className="message-text">
// //           {message.text}
// //         </div>

// //         <div className="message-meta">
// //           <span>
// //             {new Date(
// //               message.createdAt
// //             ).toLocaleTimeString([], {
// //               hour: "2-digit",
// //               minute: "2-digit",
// //             })}
// //           </span>

// //           {isOwn && (
// //             <span className="message-status">
// //               {message.status ===
// //                 "read" && "✓✓"}

// //               {message.status ===
// //                 "delivered" && "✓✓"}

// //               {message.status ===
// //                 "sent" && "✓"}
// //             </span>
// //           )}

// //           {isOwn && (
// //             <button
// //               type="button"
// //               className="message-delete-btn"
// //               onClick={handleDelete}
// //               title="Delete message"
// //             >
// //               <i className="bi bi-trash" />
// //             </button>
// //           )}
// //         </div>
// //       </div>
// //     </div>

// //   );
// // };

// // export default Message;


// // ---------------------------------------------------


// const Message = ({ message, currentUser, onDelete }) => {
//   const isOwn = message.sender?._id === currentUser._id;

//   const handleDelete = () => {
//     if (!isOwn) {
//       return;
//     }

//     const confirmed = window.confirm(
//       "Are you sure you want to delete this message?"
//     );

//     if (!confirmed) {
//       return;
//     }

//     onDelete(message._id);
//   };

//   return (
//     <div
//       className={`d-flex w-100 mb-2 px-2 px-md-3 ${
//         isOwn ? "justify-content-end" : "justify-content-start"
//       }`}
//     >
//       <div
//         className={`cw-bubble px-3 py-2 ${isOwn ? "is-own" : "is-other"}`}
//         style={{
//           maxWidth: "75%",
//           minWidth: "0",
//           overflowWrap: "anywhere",
//           wordBreak: "break-word",
//         }}
//       >
//         {/* Message Text */}
//         <div className="mb-1">{message.text}</div>

//         {/* Message Meta */}
//         <div
//           className={`d-flex align-items-center justify-content-end gap-2 small ${
//             isOwn ? "text-white-50" : "text-muted"
//           }`}
//         >
//           <span className="text-nowrap">
//             {new Date(message.createdAt).toLocaleTimeString([], {
//               hour: "2-digit",
//               minute: "2-digit",
//             })}
//           </span>

//           {/* Message Status */}
//           {isOwn && (
//             <span
//               className="fw-semibold text-nowrap"
//               title={
//                 message.status === "read"
//                   ? "Read"
//                   : message.status === "delivered"
//                   ? "Delivered"
//                   : "Sent"
//               }
//             >
//               {message.status === "read" && "✓✓"}
//               {message.status === "delivered" && "✓✓"}
//               {message.status === "sent" && "✓"}
//             </span>
//           )}

//           {/* Delete */}
//           {isOwn && (
//             <button
//               type="button"
//               className="cw-bubble-delete cw-focusable btn btn-sm p-0 border-0 text-white d-flex align-items-center"
//               onClick={handleDelete}
//               title="Delete message"
//             >
//               <i className="bi bi-trash"></i>
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Message;



const Message = ({ message, currentUser, onDelete }) => {
  const isOwn = String(message.sender?._id) === String(currentUser._id);

  const handleDelete = () => {
    if (!isOwn) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this message?"
    );

    if (!confirmed) {
      return;
    }

    onDelete(message._id);
  };

  return (
    <div
      className={`d-flex w-100 mb-2 px-2 px-md-3 ${
        isOwn ? "justify-content-end" : "justify-content-start"
      }`}
    >
      <div
        className={`cw-bubble px-3 py-2 ${isOwn ? "is-own" : "is-other"}`}
        style={{
          maxWidth: "75%",
          minWidth: "0",
          overflowWrap: "anywhere",
          wordBreak: "break-word",
        }}
      >
        {/* Message Text */}
        <div className="mb-1">{message.text}</div>

        {/* Message Meta */}
        <div
          className={`d-flex align-items-center justify-content-end gap-2 small ${
            isOwn ? "text-white-50" : "text-muted"
          }`}
        >
          <span className="text-nowrap">
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>

          {/* Message Status */}
          {/* {isOwn && (
            <span
              className="fw-semibold text-nowrap"
              title={
                message.status === "read"
                  ? "Read"
                  : message.status === "delivered"
                  ? "Delivered"
                  : "Sent"
              }
            >
              {message.status === "read" && "✓✓"}
              {message.status === "delivered" && "✓✓"}
              {message.status === "sent" && "✓"}
            </span>
          )} */}

{isOwn && (
  <span
    className={`fw-semibold text-nowrap ${
      message.status === "read" ? "text-info" : "text-white-50"
    }`}
    title={
      message.status === "read"
        ? "Read"
        : message.status === "delivered"
          ? "Delivered"
          : "Sent"
    }
    aria-label={
      message.status === "read"
        ? "Read"
        : message.status === "delivered"
          ? "Delivered"
          : "Sent"
    }
  >
    {message.status === "read" && "✓✓"}
    {message.status === "delivered" && "✓✓"}
    {(!message.status || message.status === "sent") && "✓"}
  </span>
)}
          {/* Delete */}
          {isOwn && (
            <button
              type="button"
              className="cw-bubble-delete cw-focusable btn btn-sm p-0 border-0 text-white d-flex align-items-center"
              onClick={handleDelete}
              title="Delete message"
            >
              <i className="bi bi-trash"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;

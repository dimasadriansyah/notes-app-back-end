const { nanoid } = require('nanoid');
const notes = require('./notes');
// function handler for add
const addNoteHandler = (request, h) => {
  const { title, tags, body } = request.payload;

  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const newNote = {
    title, 
    tags, 
    body, 
    id, 
    createdAt, 
    updatedAt,
  };
  notes.push(newNote);
  // get the object with used array filter()
  const isSuccess = notes.filter((note) => note.id === id).length > 0;
  // send response to client
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        noteId: id,
      },
    });
    response.code(201);
    response.header('Access-Control-Allow-Origin', '*');
    return response;
  }
  // if add failure
  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal ditambahkan',
  });
  response.code(500);
  return response;
};
// function handler for read
const getAllNotesHandler = () => ({
  status: 'success',
  data: {
    notes,
  },
});
const getNoteByIdHandler = (request, h) => {
  // back object notes with spesific based id used by path parameter
  const { id } = request.params;
  // get the object with used array filter()
  const note = notes.filter((n) => n.id === id)[0];
  if (note !== undefined) {
    return {
      status: 'success',
      data: {
        note,
      },
    };
  }
  // response if undefined
  const response = h.response({
    status: 'fail',
    message: 'Catatan tidak ditemukan',
  });
  response.code(404);
  return response;
};
//function handler for edit
const editNoteByIdHandler = (request, h) => {
  // get value id
  const { id } = request.params;
  // get new data notes where send from client through body request
  const { title, tags, body } = request.payload;
  const updatedAt = new Date().toISOString();
  //get index array at notes object as id
  const index = notes.findIndex((note) => note.id === id);
  // determine whether the request has failed or not from the index value
  if (index !== -1) {
    notes[index] = {
      ...notes[index],
      title,
      tags,
      body,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil diperbarui',
    });
    response.code(200);
    return response;
  };
  const response = h.response ({
    status: 'fail',
    message: 'Gagal memperbarui catatan. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};
// function for delete
const deleteNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = notes.findIndex((note) => note.id === id);
  // do check index value
  if (index !== -1) {
    notes.splice(index, 1);
    const response = h.response ({
      status: 'success',
      message: 'Catatan berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response ({
    status: 'fail',
    message: 'Catatam gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};
// expose module to any
module.exports = { 
  addNoteHandler, 
  getAllNotesHandler, 
  getNoteByIdHandler, 
  editNoteByIdHandler,
  deleteNoteByIdHandler 
};

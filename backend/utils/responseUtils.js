exports.responseObject = function (message, data, status = 'successful')
{
  return {
    status: status,
    message: message,
    data: data
  }
}
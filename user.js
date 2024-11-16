const { getList: getListSchema } = require('../../../dto-schemas/admin/customer/user');
const Validator = require('../../../utils/validator');

const CustomerService = require('../../../services/admin/customer/user');

const getList = async (req, res) => {
  try {
    const { query } = req;
    const data = query;

    const { errors, data: validData } = Validator.isSchemaValid({ data, schema: getListSchema });

    if (errors) {
      return res.badRequest('field-validation', errors);
    }

    const { pageSize, pageNumber } = query;
    const limit = parseInt(pageSize) || 100;
    const offset = limit * ((parseInt(pageNumber) || 1) - 1);

    const { count, doc } = await CustomerService.getList({ ...validData, limit, offset });

    res.setHeader('x-coreplatform-paging-limit', limit);
    res.setHeader('x-coreplatform-total-records', count);

    return res.getRequest(doc);
  } catch (error) {
    return res.serverError(error);
  }
};

const getDetailById = async (req, res) => {
  try {
    const { params: { publicId } } = req;

    const isValid = Validator.isValidUuid(publicId);

    if (isValid) {
      const { doc } = await CustomerService.getDetailById(publicId);

      if (doc) {
        return res.getRequest(doc);
      }

      return res.notFound(doc);
    }

    return res.badRequest('field-validation', [ { name: 'publicId', message: 'invalid publicid' } ]);
  } catch (error) {
    return res.serverError(error);
  }
};

module.exports = {
  getList, getDetailById,
};

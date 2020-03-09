import TestService from '../services/TestService';
import Util from '../utils/Utils';

const util = new Util();

class TestController {
  static async getAllTests(request, response) {
    try {
      const allTests = await TestService.getAllTests();
      if (allTests.length > 0) {
        util.setSuccess(200, 'Tests retrieved', allTests);
      } else {
        util.setSuccess(200, 'No test found');
      }
      return util.send(response);
    } catch (error) {
      util.setError(400, error);
      return util.send(response);
    }
  }

  static async addTest(request, response) {
    if (!request.body.title || !request.body.description) {
      util.setError(400, 'Please provide complete details');
      return util.send(response);
    }
    const newTest = request.body;
    try {
      const createdTest = await TestService.addTest(newTest);
      util.setSuccess(201, 'Test Added!', createdTest);
      return util.send(response);
    } catch (error) {
      util.setError(400, error.message);
      return util.send(response);
    }
  }

  static async updatedTest(request, response) {
    const alteredTest = request.body;
    const { id } = request.params;
    if (!Number(id)) {
      util.setError(400, 'Please input a valid numeric value');
      return util.send(response);
    }
    try {
      const updateTest = await TestService.updateTest(id, alteredTest);
      if (!updateTest) {
        util.setError(404, `Cannot find test with the id: ${id}`);
      } else {
        util.setSuccess(200, 'Test updated', updateTest);
      }
      return util.send(response);
    } catch (error) {
      util.setError(404, error);
      return util.send(response);
    }
  }

  static async getATest(request, response) {
    const { id } = request.params;

    if (!Number(id)) {
      util.setError(400, 'Please input a valid numeric value');
      return util.send(response);
    }

    try {
      const theTest = await TestService.getATest(id);

      if (!theTest) {
        util.setError(404, `Cannot find test with the id ${id}`);
      } else {
        util.setSuccess(200, 'Found Test', theTest);
      }
      return util.send(response);
    } catch (error) {
      util.setError(404, error);
      return util.send(response);
    }
  }

  static async deleteTest(request, response) {
    const { id } = request.params;

    if (!Number(id)) {
      util.setError(400, 'Please provide a numeric value');
      return util.send(response);
    }

    try {
      const testToDelete = await TestService.deleteTest(id);

      if (testToDelete) {
        util.setSuccess(200, 'Test deleted');
      } else {
        util.setError(404, `Test with the id ${id} cannot be found`);
      }
      return util.send(response);
    } catch (error) {
      util.setError(400, error);
      return util.send(response);
    }
  }
}

export default TestController;

const DealService = require("../service/DealService");


class DealController {

    async getDeals(req, res) {
        try {
            const deals = await DealService.getDeals();
            res.status(200).json(deals);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }   
    }

    async createDeal(req, res) {
        try {
            const deal = req.body;
            const newDeal = await DealService.createDeal(deal);
            res.status(201).json(newDeal);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async updateDeal(req, res) {
        try {
            const deal = req.body;
            const id = req.params.id;
            const updatedDeal = await DealService.updateDeal(deal, id);
            res.status(200).json(updatedDeal);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async deleteDeal(req, res) {
        try {
            const id = req.params.id;
            const deletedDeal = await DealService.deleteDeal(id);
            res.status(200).json(deletedDeal);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}
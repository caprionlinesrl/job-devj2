<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\DBAL\Connection;
use Symfony\Component\HttpFoundation\Request;

class GenreController extends AbstractController
{
    #[Route('/api/genres')]
    public function listGenre(Request $request, Connection $db): Response
    {
   $rows = $db->createQueryBuilder()
            ->select("g.*")
            ->from("genres", "g")
            ->orderBy("g.value", "Asc")
            ->executeQuery()
            ->fetchAllAssociative();

        return $this->json([
            "genres" => $rows
        ]);
    }
}
